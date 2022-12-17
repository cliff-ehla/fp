<script>
	export let member
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
</script>

<a href="/collective/{member.attributes.slug}" class="relative">
	{#if member.attributes.image.data}
		<div style="background-image: url({member.attributes.image.data.attributes.url})"
		     class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300 bg-center bg-cover"></div>
	{:else if member.attributes.wp_url}
		<div style="background-image: url({VITE_IMAGE_BASE}{member.attributes.wp_url})"
		     class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300 bg-center bg-cover"></div>
	{:else}
		<div class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300"></div>
	{/if}
	{#if member.attributes.founding_member}
		<div class="uppercase text-center text-[11px] bg-black bg-opacity-60 text-white px-2 py-0.5 absolute transform -translate-x-1/2 left-1/2 bottom-8">Founding member</div>
	{/if}
	{#if member.attributes.oversea_affiliate}
		<div class="uppercase text-center text-[11px] bg-white border border-gray-400 bg-opacity-90 px-2 py-0.5 absolute transform -translate-x-1/2 left-1/2 bottom-8">Oversea Affiliate</div>
	{/if}
	<p class="text-center mt-1 text-xl text-gray-700">{member.attributes.name}</p>
</a>