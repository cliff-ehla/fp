<script>
	export let data
	import dayjs from "dayjs";
	let post = data.data.attributes
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
</script>

<div class="container">
	<img class="mb-4 rounded shadow" src="{VITE_IMAGE_BASE}{post.wp_thumb_url}" alt={post.title}>
	<h1 class="text-2xl mb-4">{post.title}</h1>
	<div class="my-4">
		<p class="font-bold">{post.author.data.attributes.name}</p>
		<p class="text-sm">{dayjs(post.createdAt).format('DD MMM YYYY')}</p>
	</div>
	{@html post.content}
	<div class="my-4 flex flex-wrap">
		{#each post.tags.data as t}
			<p class="text-xs bg-gray-50 px-1 py-0.5 mr-1 rounded text-gray-600 border border-gray-400">{t.attributes.name}</p>
		{/each}
	</div>
</div>