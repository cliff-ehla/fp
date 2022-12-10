<script>
	export let data
	let post = data.attributes
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	console.log(data)
</script>

<div class="post-body container leading-loose text-gray-700 text-lg">
	{#if post.image.data}
		<img class="mt-8 mb-4 rounded-xl shadow-lg w-full" src="{post.image.data.attributes.url}" alt={post.title}>
	{:else}
		<img class="mt-8 mb-4 rounded-xl shadow-lg w-full" src="{VITE_IMAGE_BASE}{post.wp_url}" alt={post.title}>
	{/if}
	<h1 class="text-2xl text-gray-800 mb-4">{post.title}</h1>
	<div class="flex flex-wrap my-4">
		<span class="text-sm mr-1 mt-0.5 text-gray-500">檔案:</span>
		{#each post.event_categories.data as t}
			<a href="/art-notes/category/{t.attributes.slug}/1" class="text-base border-b border-gray-700 text-gray-700 mr-2 mb-1">{t.attributes.name}</a>
		{/each}
	</div>
	{@html post.content}
	<div class="my-4 flex flex-wrap">
		{#each post.tags.data as t}
			<a href="/tag/{t.attributes.slug}/1"
			   class="text-base bg-gray-50 px-2 py-1 mr-1 mb-1 rounded text-gray-600 border border-gray-400">{t.attributes.name}</a>
		{/each}
	</div>
</div>

<div class="container">
	<h2 class="font-bold text-xl mb-4">Related reviews on this event</h2>
	{#if post.reviews.data.length}
		<div class="grid grid-cols-2 gap-8">
			{#each post.reviews.data as post}
				<a href="/art-notes/{post.attributes.slug}" class="border border-gray-400 rounded-lg overflow-hidden">
					{#if post.attributes.image}
						<img class="m-0 mb-4 rounded-xl shadow-lg w-full" src="{post.attributes.image.data.attributes.url}" alt={post.attributes.title}>
					{:else}
						<img src="{VITE_IMAGE_BASE}{post.attributes.wp_thumb_url}" alt={post.attributes.title}>
					{/if}
					<div class="p-2">
						<h3 class="font-bold text-base leading-tight">{post.attributes.title}</h3>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<p>No data</p>
	{/if}
	<div class="my-8">
		<h2 class="font-bold text-xl mb-4">Artists in this event</h2>
		{#if post.artists.data.length}
			<div class="grid grid-cols-3 gap-4">
				{#each post.artists.data as artist}
					<a href="/people/{artist.attributes.slug}" class="flex mb-4 items-center border border-gray-300 rounded-full">
						<div class="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 border border-gray-400"></div>
						<div class="px-2 leading-tight">
							{artist.attributes.name}
						</div>
					</a>
				{/each}
			</div>
		{:else}
			No data
		{/if}
	</div>
</div>