<script>
	import '../style/tailwind.css'
</script>
<div class="flex px-4 items-center border-b border-gray-400 h-12">
	<p class="font-bold mr-4">Floating Project</p>
	<a href="/blog">Art notes</a>
	<a href="/event">Events</a>
	<a href="/about">About</a>
</div>
<slot></slot>

<style>
	a {
		@apply mx-2;
	}
</style>