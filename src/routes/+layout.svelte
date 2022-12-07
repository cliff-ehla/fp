<script>
	import { base } from '$app/paths';
	import '../style/tailwind.css'
</script>
<div class="flex px-4 items-center border-b border-gray-400 h-12">
	<a href="/{base}" class="font-bold mr-4">Floating Project 3</a>
	<a href="{base}/art-notes/page/1">Art notes</a>
	<a href="{base}/event">Events</a>
	<a href="{base}/collective">Collective</a>
	<a href="{base}/about">About</a>
</div>
<slot></slot>

<style>
	a {
		@apply mx-2;
	}
</style>