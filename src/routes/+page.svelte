<script>
	import {fly} from 'svelte/transition'
	import {onMount} from "svelte";
	let show_logo = false
	onMount(() => {
		setTimeout(() => {
			show_logo = true
		}, 10)
	})
</script>
{#if show_logo}
	<img in:fly={{duration: 2500, y: 40}} src="/fp-logo.png" alt="">
{/if}