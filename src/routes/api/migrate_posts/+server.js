import {json} from "@sveltejs/kit";
import {db} from "../../../lib/db.js";

export const POST = async () => {
	let res = await fetch('http://localhost:8888/wp-json/wp/v2/posts?per_page=50')
	let posts = await res.json()

	const result = await Promise.all(posts.map(post => new Promise(async (resolve, reject) => {
		let featured_media = post.featured_media
		let res2 = await fetch(`http://localhost:8888/wp-json/wp/v2/media/${featured_media}`)
		let json2 = await res2.json()
		let wp_large_url
		let wp_thumb_url
		if (json2.media_details.sizes.large) {
			wp_large_url = json2.media_details.sizes.large.source_url
			wp_large_url = wp_large_url.split('http://localhost:8888/wp-content/uploads')[1]
		}
		if (json2.media_details.sizes["blog-thumb-1"]) {
			wp_thumb_url = json2.media_details.sizes["blog-thumb-1"].source_url
			wp_thumb_url = wp_thumb_url.split('http://localhost:8888/wp-content/uploads')[1]
		}
		let payload = {
			title: post.title.rendered,
			excerpt: post.excerpt.rendered,
			content: post.content.rendered,
			slug: post.slug,
			wp_large_url,
			wp_thumb_url,
			author: post.author,
			tags: post.tags,
			categories: post.categories,
			id: post.id
		}

		let res3 = await fetch('http://localhost:1337/api/posts', {
			method: 'POST',
			body: JSON.stringify({
				data: payload
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'bearer 62f46ad28f35dfce1e68b04a87d5448d3177ab599b49de295308bcc59bda1079413583412b9604869a0fdf202d63416dce4f0d3cb908fd8e45724746c22fbdf199dc66f8601085cf48fa779ce8fd6abe6cd391717a3db3b7f6c71b45eb969106aa211689eaa2d2cd29667d68f5ecce638c133f2933193b35ef27f69c2759668b'
			}
		})

		// update create_ts
		let created_at = post.date.replace('T', ' ')+'.386000'
		let published_at = created_at
		let updated_at = post.modified.replace('T', ' ')+'.386000'
		const res4 = await db.query(`
			UPDATE posts 
				SET created_at = '${created_at}',
				published_at = '${published_at}',
				updated_at = '${updated_at}' 
			WHERE (id = '${post.id}');		
		`)
		resolve(res4[0])
	})))

	return json({
		posts,
		result
	})
}