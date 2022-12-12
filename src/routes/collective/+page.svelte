<script>
	import dayjs from 'dayjs'
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	export let data
	$: collective = data.data
	$: past_members = collective.filter(c => {
		return dayjs(c.attributes.membership_end).isBefore(dayjs())
	})
	$: active_members = collective.filter(c => {
		return !c.attributes.membership_end
	})
</script>

<div class="py-8">
	<div class="container">
		<p class="text-gray-700 mb-4 text-center pt-4 text-2xl">Current members</p>
	</div>
	<div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
		{#each active_members as member}
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
		{/each}
	</div>
</div>
<div class="bg-gray-100 border-t border-gray-200 py-8">
	<div class="container">
		<p class="text-gray-700 mb-4 text-center text-2xl">Past members</p>
	</div>
	<div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
		{#each past_members as member}
			<div>
				{#if member.attributes.image.data}
					<img src={member.attributes.image.data.attributes.url}
					     class="rounded-full shadow-lg mx-auto w-48 border-8 border-gray-300"
					     alt={member.attributes.name}>
				{:else}
				<div class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300"></div>
				{/if}
				<p class="text-center mt-1 text-xl text-gray-700">{member.attributes.name}</p>
			</div>
		{/each}
	</div>
</div>