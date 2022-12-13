<script>
	import EventPreview from "../../../../../lib/EventPreview.svelte";
	export let data
	$: events = data.events
	let pagination = data.pagination
</script>

<div class="container">
	{#each events as event}
		<EventPreview {event}/>
	{/each}
</div>
