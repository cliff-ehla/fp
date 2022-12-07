<script>
	export let data
	import dayjs from 'dayjs'
	import { base } from '$app/paths';
	$: posts = data.data
	let pagination = data.meta.pagination
</script>

<div class="p-4">
	{#each posts as p}
		<a href="{base}/art-notes/{p.id}" class="flex mb-8">
			<span class="w-48 flex-shrink-0">
				<img src="https://floatingprojectscollective.net/wp-content/uploads/{p.attributes.wp_thumb_url}" alt="">
			</span>
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
	<div class="flex">
		{#each Array.from({length: pagination.pageCount}, (v, i) => i) as i}
			<a class="flex justify-center items-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300 mx-2" href="/art-notes/page/{i+1}">{i + 1}</a>
		{/each}
	</div>
</div>