<script>
	let menu = [
		{
			name: 'What We Do',
			slug: 'introduction'
		},
		{
			name: 'What We Envision',
			slug: 'conceptual'
		},
		{
			name: 'Media Coverage',
			slug: 'media'
		},
		{
			name: 'Contact Us',
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