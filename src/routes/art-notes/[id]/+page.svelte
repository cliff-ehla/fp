<script>
	export let data
	let post = data.data.attributes
	const convert = (string) => {
		var dummy = document.createElement('textarea');
		dummy.innerHTML = string;
		return dummy.value;

	}
</script>

<div class="p-4">
	<h1 class="text-4xl mb-4">{convert(post.title)}</h1>
	{@html post.content}
</div>