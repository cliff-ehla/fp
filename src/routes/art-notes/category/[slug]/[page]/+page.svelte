<script>
	import PostPreview from "../../../../../lib/PostPreview.svelte";
	export let data
	import {page} from "$app/stores";
	$: posts = data.posts
	$: pagination = data.pagination
	$: category = data.category
</script>

<div class="container my-4">
	<div class="bg-white border border-gray-300 rounded-xl p-4 mb-8 shadow-lg">
		<h1 class="mb-2 text-blue-800 font-bold">Category: {category.attributes.name}</h1>
		<p>{category.attributes.description}</p>
	</div>
	{#each posts as post, i}
		<PostPreview {post}/>
		{#if i < posts.length - 1}
			<div class="h-[1px] bg-gray-300 my-6"></div>
		{/if}
	{/each}
</div>

<div class="bg-gray-50 mt-6 py-6 border-t border-gray-300">
	<div class="container flex flex-wrap justify-center">
		{#each Array.from({length: pagination.pageCount}, (v, i) => i) as i}
			<a class="text-xs flex justify-center items-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300 m-1" href="/art-notes/category/{$page.params.slug}/{i+1}">{i + 1}</a>
		{/each}
	</div>
</div>