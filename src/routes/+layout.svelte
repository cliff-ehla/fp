<script>
	import '../style/tailwind.css'
	import dayjs from "dayjs";
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
<div class="bg-gray-100 text-gray-500 text-base border-t border-gray-300 mt-8">
	<div class="container py-12 text-center">
		Floating Projects Collective {dayjs().format('YYYY')}
	</div>
</div>

<style>
	a {
		@apply mx-0.5 p-2;
	}
</style>