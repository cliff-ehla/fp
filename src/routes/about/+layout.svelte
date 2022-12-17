<script>
	let menu = [
		{
			name: 'Introduction',
			slug: 'introduction'
		},
		{
			name: 'Conceptual',
			slug: 'conceptual'
		},
		{
			name: 'Contact',
			slug: 'contact'
		}
	]
</script>

<div class="container py-4 border-b border-gray-300">
	<ul class="flex justify-center">
		{#each menu as m}
			<li>
				<a class="p-4" href="/about/{m.slug}">{m.name}</a>
			</li>
		{/each}
	</ul>
</div>

<slot/>