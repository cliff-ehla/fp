<script>
	export let data
	let post = data.data.attributes
</script>

<div class="p-4">
	<h1 class="text-4xl mb-4">{post.title}</h1>
	{@html post.content}
</div>