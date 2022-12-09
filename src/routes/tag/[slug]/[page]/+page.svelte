<script>
	import PostPreview from "../../../../lib/PostPreview.svelte";
	export let data
	$: posts = data.data
	let pagination = data.meta.pagination
	import {page} from "$app/stores";
</script>

<div class="container py-8">
	<h1 class="mb-4 italic text-blue-800">Searching for tag: <b>{$page.params.slug}</b></h1>
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
			<a class="text-xs flex justify-center items-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300 m-1" href="/tag/page/{i+1}">{i + 1}</a>
		{/each}
	</div>
</div>