<script>
	import { base } from '$app/paths';
	import '../style/tailwind.css'
</script>
<div class="bg-red-500 text-white text-xs py-1 text-center">
	注意：網站正在收復中
</div>
<div class="flex flex-wrap px-4 border-b border-gray-400">
	<a href="/{base}" class="font-bold mr-4">Floating Projects</a>
	<a href="{base}/art-notes/page/1">Art notes</a>
	<a href="{base}/event">Events</a>
	<a href="{base}/collective">Collective</a>
	<a href="{base}/about">About</a>
</div>
<slot></slot>

<style>
	a {
		@apply mx-0.5 p-2;
	}
</style>