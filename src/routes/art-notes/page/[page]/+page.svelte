<script>
	export let data
	import dayjs from 'dayjs'
	import { base } from '$app/paths';
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	$: posts = data.data
	let pagination = data.meta.pagination
</script>

<div class="container">
	{#each posts as p, i}
		<a href="{base}/art-notes/{p.id}" class="flex flex-col sm:flex-row">
			<div class="w-full sm:w-48 flex-shrink-0">
				<img class="rounded-xl border border-gray-300 shadow-xl" src="{VITE_IMAGE_BASE}{p.attributes.wp_thumb_url}" alt="">
			</div>
			<div class="ml-0 sm:ml-4 mt-2 sm:mt-0">
				<h2 class="text-lg leading-tight"><b>{p.attributes.title}</b></h2>
				<div class="flex items-center">
					<div class="w-8 h-8 rounded-full bg-gray-100 border border-gray-400"></div>
					<div class="ml-2 my-2">
						<p class="text-sm font-bold text-gray-700">{p.attributes.author.data.attributes.name}</p>
						<p class="text-xs">發表於 {dayjs(p.attributes.createdAt).format('YYYY-MM-DD')}</p>
					</div>
				</div>
				<p class="mb-2 text-gray-700 text-sm">{@html p.attributes.excerpt}</p>
				<div class="flex flex-wrap">
					{#each p.attributes.tags.data as t}
						<p class="text-xs px-1 bg-gray-200 text-blue-900 italic rounded border-gray-200 border mr-2 mb-1">{t.attributes.name}</p>
					{/each}
				</div>
				<div class="flex flex-wrap">
					{#each p.attributes.categories.data as t}
						<p class="text-sm bg-red-300 mr-2 mb-1">{t.attributes.name}</p>
					{/each}
				</div>
			</div>
		</a>
		{#if i < posts.length - 1}
			<div class="h-[1px] bg-gray-300 my-6"></div>
		{/if}
	{/each}
</div>

<div class="bg-gray-50 mt-6 py-6 border-t border-gray-300">
	<div class="container flex flex-wrap justify-center">
		{#each Array.from({length: pagination.pageCount}, (v, i) => i) as i}
			<a class="text-xs flex justify-center items-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300 m-1" href="/art-notes/page/{i+1}">{i + 1}</a>
		{/each}
	</div>
</div>