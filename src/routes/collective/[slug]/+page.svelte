<script>
	export let data
	$: member = data
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
</script>

<div class="container py-8">
	<a href="/collective/{member.attributes.slug}">
		{#if member.attributes.image.data}
			<div style="background-image: url({member.attributes.image.data.attributes.url})"
			     class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300 bg-center bg-cover"></div>
		{:else if member.attributes.wp_url}
			<div style="background-image: url({VITE_IMAGE_BASE}{member.attributes.wp_url})"
			     class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300 bg-center bg-cover"></div>
		{:else}
			<div class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300"></div>
		{/if}
		<p class="text-center mt-1 text-xl text-gray-700">{member.attributes.name}</p>
	</a>
	<p class="text-center">{member.attributes.name}</p>
	<p>{member.attributes.profile}</p>
</div>
