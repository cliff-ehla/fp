<script>
	import {onMount} from "svelte";
	let post
	let image_link
	onMount(async () => {
		// await getTagsFromWP()
		// await getCategoriesFromWP()
		let res = await fetch("http://localhost:8888/wp-json/wp/v2/posts/15802")
		let json = await res.json()
		post = json
		const image_id = json.feature_image
		let res2 = await fetch(`http://localhost:8888/wp-json/wp/v2/media/${image_id}`)
		let json2 = await res2.json()
		image_link = json2.source_url
		// image_link = json2.media_details.image_meta.sizes.medium.source_url
		// console.log(json2)
	})
</script>

{#if post}
	<p>{post.date}</p>
	<p>by {post.author}</p>
	<p>image {post.featured_media}</p>
	{#if image_link}
		<p>{image_link}</p>
		<img src={image_link} alt="">
	{/if}
	{@html post.title.rendered}
	{@html post.content.rendered}
{/if}