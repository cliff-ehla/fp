<script>
	export let data
	import dayjs from 'dayjs'
	let posts = data.data
</script>
<div class="p-4">
{#if posts}
	{#each posts as p}
		<a href="/blog/{p.id}" class="flex mb-8">
			<img class="max-w-sm rounded" src="http://localhost:8888/wp-content/uploads/{p.attributes.wp_large_url}" alt="">
			<div class="ml-4">
				<h2 class="text-xl"><b>{p.attributes.title}</b></h2>
				<p class="mb-4 text-gray-700">{p.attributes.author.data.attributes.name}</p>
				<p>{dayjs(p.attributes.createdAt).format('YYYY-MM-DD')}</p>
				<div class="flex flex-wrap mt-2">
					{#each p.attributes.tags.data as t}
						<p class="text-sm px-1 bg-gray-100 rounded border-gray-200 border mr-2 mb-1">{t.attributes.name}</p>
					{/each}
				</div>
				<div class="flex flex-wrap">
					{#each p.attributes.categories.data as t}
						<p class="text-sm bg-red-300 mr-2 mb-1">{t.attributes.name}</p>
					{/each}
				</div>
			</div>
		</a>
	{/each}
{/if}
</div>