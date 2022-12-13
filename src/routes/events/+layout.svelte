<script>
	export let data
</script>
<div class="bg-gray-100 py-4 border-b border-gray-300 text-center">
	<div class="container">
		{#each data.category_list as cat}
			<a href="/events/category/{cat.attributes.slug}/1"
			   class="text-sm py-0.5 mx-2 inline-block mb-0.5 whitespace-nowrap text-gray-700 border-b border-gray-400"
			>{cat.attributes.name}</a>
		{/each}
	</div>
</div>
<slot></slot>
