<script>
	import {page} from "$app/stores";
	$: slug = $page.params.slug
	export let data
	$: content = data.data.attributes[slug]
</script>

<div class="mx-auto py-8 px-4 max-w-screen-md">
	<div>{@html content}</div>
</div>