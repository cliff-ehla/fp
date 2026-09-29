<script>
	import thumbs from '../../lib/member-thumbs.json'
	export let member
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE

	$: a = member.attributes
	/* This list only ever draws a 192px circle, but the originals on S3 are
	   full-size — the roster came to about 13MB before this. Prefer the 384px
	   WebP built by scripts/build_member_thumbs.sh, and fall back to the
	   original for anyone the script has not covered yet. */
	$: src = thumbs[a.slug]
		|| (a.image && a.image.data ? a.image.data.attributes.url : null)
		|| (a.wp_url ? VITE_IMAGE_BASE + a.wp_url : null)
</script>

<a href="/collective/{a.slug}" class="relative block">
	{#if src}
		<img
			{src}
			alt={a.name}
			width="384"
			height="384"
			loading="lazy"
			decoding="async"
			class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300 object-cover"/>
	{:else}
		<div class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300"></div>
	{/if}
	{#if a.founding_member}
		<div class="uppercase text-center text-[11px] bg-black bg-opacity-60 text-white px-2 py-0.5 absolute transform -translate-x-1/2 left-1/2 bottom-8">Founding member</div>
	{/if}
	<p class="text-center mt-1 text-xl text-gray-700">{a.name}</p>
</a>
