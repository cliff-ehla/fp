<script>
	import EventPreview from "../../../../lib/EventPreview.svelte";
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	export let data
	$: events = data.data
	let pagination = data.meta.pagination
</script>

<div class="container">
	{#each events as event}
		<EventPreview {event}/>
	{/each}
</div>

<div class="bg-gray-50 mt-6 py-6 border-t border-gray-300">
	<div class="container flex flex-wrap justify-center">
		{#each Array.from({length: pagination.pageCount}, (v, i) => i) as i}
			<a class="text-xs flex justify-center items-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300 m-1" href="/events/page/{i+1}">{i + 1}</a>
		{/each}
	</div>
</div>