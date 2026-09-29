#!/usr/bin/env bash
# Build the list-view thumbnails for /collective.
#
# The member photos are full-size originals on S3 — around 13 MB across the
# roster — but the list renders them as 192px circles. This downloads each one,
# crops it square, and writes a 384px WebP (2x for retina) into static/members/,
# plus a manifest the page imports. Re-run it after adding or changing a member
# photo, then commit what changes.
#
# Needs: sips (macOS built-in) and cwebp (brew install webp).

set -euo pipefail

cd "$(dirname "$0")/.."

OUT_DIR="static/members"
MANIFEST="src/lib/member-thumbs.json"
SIZE=384
QUALITY=80

command -v cwebp >/dev/null || { echo "cwebp not found — brew install webp"; exit 1; }
command -v sips  >/dev/null || { echo "sips not found — this script needs macOS"; exit 1; }

API_BASE=$(grep '^VITE_API_BASE=' .env.production | cut -d= -f2-)
TOKEN=$(grep '^VITE_STRAPI_TOKEN=' .env | cut -d= -f2-)
IMAGE_BASE=$(grep '^VITE_IMAGE_BASE=' .env.production | cut -d= -f2-)

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "Fetching member list…"
curl -s -H "Authorization: bearer $TOKEN" \
  "$API_BASE/api/authors?filters%5Bis_member%5D=true&pagination%5BpageSize%5D=200&populate=*&sort=createdAt%3Adesc" \
  -o "$TMP/authors.json"

node -e '
const fs = require("fs");
const d = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const imageBase = process.argv[2];
(d.data || []).forEach(r => {
  const a = r.attributes || {};
  const cms = a.image && a.image.data && a.image.data.attributes && a.image.data.attributes.url;
  const url = cms || (a.wp_url ? imageBase + a.wp_url : null);
  if (a.slug && url) console.log(a.slug + "\t" + url);
});
' "$TMP/authors.json" "$IMAGE_BASE" > "$TMP/list.tsv"

mkdir -p "$OUT_DIR"
made=0
: > "$TMP/manifest.tsv"

while IFS=$'\t' read -r slug url; do
  [ -z "$slug" ] && continue
  # sips picks its output format from the file extension, so every
  # intermediate here stays .jpg
  src="$TMP/$slug.src.jpg"
  if ! curl -sfL "$url" --max-time 60 -o "$src"; then
    echo "  skip $slug — could not fetch"
    continue
  fi

  # scale the short edge up to SIZE, then crop the long edge off centre,
  # so the circle is filled rather than letterboxed
  w=$(sips -g pixelWidth  "$src" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$src" | awk '/pixelHeight/{print $2}')
  [ -z "$w" ] && { echo "  skip $slug — not an image"; continue; }
  if [ "$w" -le "$h" ]; then
    sips --resampleWidth  "$SIZE" "$src" --out "$TMP/$slug.step.jpg" >/dev/null
  else
    sips --resampleHeight "$SIZE" "$src" --out "$TMP/$slug.step.jpg" >/dev/null
  fi
  sips -c "$SIZE" "$SIZE" "$TMP/$slug.step.jpg" --out "$TMP/$slug.sq.jpg" >/dev/null

  cwebp -quiet -q "$QUALITY" "$TMP/$slug.sq.jpg" -o "$OUT_DIR/$slug.webp"
  before=$(wc -c < "$src" | tr -d ' ')
  after=$(wc -c < "$OUT_DIR/$slug.webp" | tr -d ' ')
  printf "  %-28s %6s KB -> %4s KB\n" "$slug" "$((before/1024))" "$((after/1024))"
  printf '%s\t%s\n' "$slug" "/members/$slug.webp" >> "$TMP/manifest.tsv"
  made=$((made+1))
done < "$TMP/list.tsv"

node -e '
const fs = require("fs");
const out = {};
fs.readFileSync(process.argv[1], "utf8").split("\n").filter(Boolean).forEach(line => {
  const [slug, path] = line.split("\t");
  out[slug] = path;
});
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, "\t") + "\n");
' "$TMP/manifest.tsv" "$MANIFEST"

echo "Wrote $made thumbnails to $OUT_DIR and the manifest to $MANIFEST"
