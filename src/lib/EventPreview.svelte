<script>
	import dayjs from "dayjs";
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	export let event
	$: p = event
</script>

<a href="/events/{p.attributes.slug}" class="hover:bg-blue-50 hover:text-blue-600 flex flex-col sm:flex-row my-6">
	<div class="w-full sm:w-48 flex-shrink-0">
		{#if p.attributes.image.data}
			<img class="rounded-xl border border-gray-300 shadow-xl" src="{p.attributes.image.data.attributes.url}" alt="{p.attributes.title}">
		{:else}
			<img class="rounded-xl border border-gray-300 shadow-xl" src="{VITE_IMAGE_BASE}{p.attributes.wp_url}" alt="{p.attributes.title}">
		{/if}
	</div>
	<div class="ml-0 sm:ml-4 mt-2 sm:mt-0">
		<p class="italic text-blue-900 font-bold">
			{dayjs(p.attributes.start_date).format('YYYY.MM.DD')}
			{#if p.attributes.end_date}
				- {dayjs(p.attributes.end_date).format('MM.DD')}
			{/if}
		</p>
		<h2 class="text-lg leading-tight font-bold">
			{p.attributes.title}
		</h2>
		<p class="mb-2 text-gray-700 text-sm">{@html p.attributes.excerpt}</p>
		{#if p.attributes.event_categories}
		<div class="flex flex-wrap">
			<span class="text-xs mr-1 mt-0.5 text-gray-500">分類:</span>
			{#each p.attributes.event_categories.data as t}
				<a href="/art-notes/category/{t.attributes.slug}/1" class="text-sm border-b border-gray-700 text-gray-700 mr-2 mb-1">{t.attributes.name}</a>
			{/each}
		</div>
		{/if}
	</div>
</a>