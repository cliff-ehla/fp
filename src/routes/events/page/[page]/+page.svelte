<script>
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	export let data
	$: events = data.data
	let pagination = data.meta.pagination
</script>

<div class="container">
	{#each events as p}
		<a class="flex flex-col sm:flex-row my-6">
			<div class="w-full sm:w-48 flex-shrink-0">
				{#if p.attributes.image.data}
					<img class="rounded-xl border border-gray-300 shadow-xl" src="{p.attributes.image.data.attributes.url}" alt="{p.attributes.title}">
				{:else}
					<img class="rounded-xl border border-gray-300 shadow-xl" src="{VITE_IMAGE_BASE}{p.attributes.wp_url}" alt="{p.attributes.title}">
				{/if}
			</div>
			<div class="ml-0 sm:ml-4 mt-2 sm:mt-0">
				<h2 class="text-lg leading-tight font-bold">
					<a href="/events/{p.attributes.slug}">
						{p.attributes.title}
					</a>
				</h2>
				<p class="mb-2 text-gray-700 text-sm">{@html p.attributes.excerpt}</p>
				<div class="flex flex-wrap 幵-4">
					<span class="text-xs mr-1 mt-0.5 text-gray-500">分類:</span>
					{#each p.attributes.event_categories.data as t}
						<a href="/art-notes/category/{t.attributes.slug}/1" class="text-sm border-b border-gray-700 text-gray-700 mr-2 mb-1">{t.attributes.name}</a>
					{/each}
				</div>
			</div>
		</a>
	{/each}
</div>

<div class="bg-gray-50 mt-6 py-6 border-t border-gray-300">
	<div class="container flex flex-wrap justify-center">
		{#each Array.from({length: pagination.pageCount}, (v, i) => i) as i}
			<a class="text-xs flex justify-center items-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300 m-1" href="/events/page/{i+1}">{i + 1}</a>
		{/each}
	</div>
</div>