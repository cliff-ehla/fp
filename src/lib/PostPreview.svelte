<script>
	import dayjs from 'dayjs'
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	export let post
	let p = post
</script>
<a class="flex flex-col sm:flex-row">
	<div class="w-full sm:w-48 flex-shrink-0">
		<img class="rounded-xl border border-gray-300 shadow-xl" src="{VITE_IMAGE_BASE}{p.attributes.wp_thumb_url}" alt="">
	</div>
	<div class="ml-0 sm:ml-4 mt-2 sm:mt-0">
		<h2 class="text-lg leading-tight font-bold">
			<a href="/art-notes/{p.id}">
				{p.attributes.title}
			</a>
		</h2>
		<div class="flex items-center">
			<div class="w-8 h-8 rounded-full bg-gray-100 border border-gray-400"></div>
			<a href="/author/{p.attributes.author.data.attributes.slug}/1" class="ml-2 my-2">
				<p class="text-sm font-bold text-gray-700">{p.attributes.author.data.attributes.name}</p>
				<p class="text-xs">發表於 {dayjs(p.attributes.createdAt).format('YYYY-MM-DD')}</p>
			</a>
		</div>
		<p class="mb-2 text-gray-700 text-sm">{@html p.attributes.excerpt}</p>
		<div class="flex flex-wrap">
			{#each p.attributes.tags.data as t}
				<a href="/tag/{t.attributes.slug}/1" class="text-xs px-1 bg-gray-200 text-blue-900 italic rounded border-gray-200 border mr-2 mb-1">{t.attributes.name}</a>
			{/each}
		</div>
		<div class="flex flex-wrap">
			{#each p.attributes.categories.data as t}
				<p class="text-sm bg-red-300 mr-2 mb-1">{t.attributes.name}</p>
			{/each}
		</div>
	</div>
</a>