<script>
	export let data
	$: post = data.data[0]
</script>

<div class="mx-auto py-8 px-4 max-w-screen-md">
	{#if post}
		<div>{@html post.attributes.content}</div>
	{/if}
</div>