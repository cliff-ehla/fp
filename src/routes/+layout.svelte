<script>
	import { base } from '$app/paths';
	import '../style/tailwind.css'
</script>
<div class="shadow bg-white">
	<div class="text-center pt-4">
		<a href="/" class="font-bold">Floating Projects</a>
	</div>
	<div class="flex justify-center px-4 border-b border-gray-300">
		<a href="/art-notes/page/1">Art notes</a>
		<a href="/event">Events</a>
		<a href="/collective">Collective</a>
		<a href="/about">About</a>
	</div>
</div>
<slot></slot>

<style>
	a {
		@apply mx-0.5 p-2;
	}
</style>