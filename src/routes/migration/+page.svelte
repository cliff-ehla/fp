<script>
	import {onMount} from "svelte";
	onMount(() => {
		// getTagsFromWP()
		// getUsersFromWP()
		// getCategoriesFromWP()
		getPostsFromWP()
	})

	const getCategoriesFromWP = async () => {
		let res = await fetch('http://localhost:8888/wp-json/wp/v2/categories')
		let json = await res.json()
		const posts = await Promise.all(json.map(post => new Promise(async (resolve, reject) => {
			if (post.slug.indexOf('-%') > 0) {
				post.slug = post.slug.split('-%')[0]
			}
			let payload = {
				name: post.name,
				description: post.description,
				slug: post.slug,
				id: post.id
			}
			let res = await fetch('http://localhost:1337/api/categories', {
				method: 'POST',
				body: JSON.stringify({
					data: payload
				}),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'bearer 62f46ad28f35dfce1e68b04a87d5448d3177ab599b49de295308bcc59bda1079413583412b9604869a0fdf202d63416dce4f0d3cb908fd8e45724746c22fbdf199dc66f8601085cf48fa779ce8fd6abe6cd391717a3db3b7f6c71b45eb969106aa211689eaa2d2cd29667d68f5ecce638c133f2933193b35ef27f69c2759668b'
				}
			})
			resolve(await res.json())
		})))
		console.log(posts)
	}

	const getTagsFromWP = async () => {
		let res = await fetch('http://localhost:8888/wp-json/wp/v2/tags?per_page=100&page=15')
		let json = await res.json()
		return console.log(json)
		const posts = await Promise.all(json.map(post => new Promise(async (resolve, reject) => {
			let payload = {
				name: post.name,
				slug: post.slug,
				id: post.id
			}
			let res = await fetch('http://localhost:1337/api/tags', {
				method: 'POST',
				body: JSON.stringify({
					data: payload
				}),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'bearer 62f46ad28f35dfce1e68b04a87d5448d3177ab599b49de295308bcc59bda1079413583412b9604869a0fdf202d63416dce4f0d3cb908fd8e45724746c22fbdf199dc66f8601085cf48fa779ce8fd6abe6cd391717a3db3b7f6c71b45eb969106aa211689eaa2d2cd29667d68f5ecce638c133f2933193b35ef27f69c2759668b'
				}
			})
			resolve(await res.json())
		})))
		console.log(posts)
	}

	const getUsersFromWP = async () => {
		let res = await fetch('http://localhost:8888/wp-json/wp/v2/users?per_page=100&page=1')
		let json = await res.json()
		// return console.log('users', json)
		const posts = await Promise.all(json.map(post => new Promise(async (resolve, reject) => {
			let payload = {
				name: post.name,
				slug: post.slug,
				id: post.id
			}
			let res = await fetch('http://localhost:1337/api/members', {
				method: 'POST',
				body: JSON.stringify({
					data: payload
				}),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'bearer 62f46ad28f35dfce1e68b04a87d5448d3177ab599b49de295308bcc59bda1079413583412b9604869a0fdf202d63416dce4f0d3cb908fd8e45724746c22fbdf199dc66f8601085cf48fa779ce8fd6abe6cd391717a3db3b7f6c71b45eb969106aa211689eaa2d2cd29667d68f5ecce638c133f2933193b35ef27f69c2759668b'
				}
			})
			resolve(await res.json())
		})))
		console.log(posts)
	}

	const getPostsFromWP = async () => {
		let res = await fetch('http://localhost:8888/wp-json/wp/v2/posts?per_page=1')
		let json = await res.json()
		const posts = await Promise.all(json.map(post => new Promise(async (resolve, reject) => {
			let featured_media = post.featured_media
			let res2 = await fetch(`http://localhost:8888/wp-json/wp/v2/media/${featured_media}`)
			let json2 = await res2.json()
			let _large_url = json2.media_details.sizes.large.source_url // json2.source_url
			let _thumb_url = json2.media_details.sizes["blog-thumb-1"].source_url // json2.source_url
			_large_url = _large_url.split('http://localhost:8888/wp-content/uploads')[1]
			_thumb_url = _thumb_url.split('http://localhost:8888/wp-content/uploads')[1]
			let payload = {
				title: post.title.rendered,
				excerpt: post.excerpt.rendered,
				content: post.content.rendered,
				slug: post.slug,
				_large_url,
				_thumb_url,
				author: post.author,
				tags: post.tags,
				categories: post.categories,
				id: post.id
			}
			// createdAt: post.date,
			// updatedAt: post.modified

			resolve(payload)
			// let res3 = await fetch('http://localhost:1337/api/blogs', {
			// 	method: 'POST',
			// 	body: JSON.stringify({
			// 		data: payload
			// 	}),
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		'Authorization': 'bearer 62f46ad28f35dfce1e68b04a87d5448d3177ab599b49de295308bcc59bda1079413583412b9604869a0fdf202d63416dce4f0d3cb908fd8e45724746c22fbdf199dc66f8601085cf48fa779ce8fd6abe6cd391717a3db3b7f6c71b45eb969106aa211689eaa2d2cd29667d68f5ecce638c133f2933193b35ef27f69c2759668b'
			// 	}
			// })
			// resolve(await res3.json())
		})))
		console.log(posts)
	}
</script>