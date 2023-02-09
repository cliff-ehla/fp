<script>
	import '../style/tailwind.css'
	import dayjs from "dayjs";
	import {navigating} from "$app/stores";
	import IndeterminateLoadingBar from "../lib/IndeterminateLoadingBar.svelte";
	const menu = [
		{
			title: '據點一杯茶',
			subtitle: 'Floating Teatime',
			href: '/art-notes/page/1'
		},{
			title: '打開門',
			subtitle: 'Open Door',
			href: '/events/page/1'
		},{
			title: '據點。句點群體',
			subtitle: 'Collective',
			href: '/collective'
		},{
			title: '重點策劃',
			subtitle: 'Signature Projects',
			href: '/signature-projects'
		},{
			title: '關於我們',
			subtitle: 'About',
			href: '/about/introduction'
		},
	]
</script>
{#if $navigating}
	<div class="fixed inset-x-0 top-0 z-50">
		<IndeterminateLoadingBar/>
	</div>
{/if}
<div class="shadow bg-white">
	<div class="text-center flex justify-center">
		<a href="/" class="p-2 sm:p-0 sm:block sm:absolute sm:left-4 sm:top-3">
			<img class="mx-auto w-6" src="/fp-icon.png" alt="fp-icon">
		</a>
	</div>
	<div class="flex items-center flex-wrap justify-center">
		{#each menu as item}
			<a href="{item.href}" class="px-3 py-1 inline-flex flex-col items-center">
				<b class="text-sm sm:text-base whitespace-nowrap">{item.title}</b>
				<span class="text-xs">{item.subtitle}</span>
			</a>
		{/each}
	</div>
</div>
<slot></slot>
<div class="bg-gray-100 text-gray-500 text-base border-t border-gray-300 py-8">
	<div class="flex items-center justify-center mb-2">
		<a href="https://www.facebook.com/floatingprojects/" target="_blank">
			<img class="social" src="/fb.png" alt="FP facebook">
		</a>
		<a href="https://www.instagram.com/floatingprojects/" target="_blank">
			<img class="social" src="/ig.png" alt="FP instagram">
		</a>
		<a href="https://vimeo.com/floatingprojectsvideos" target="_blank">
			<img class="social" src="/vimeo.png" alt="FP instagram">
		</a>
	</div>
	<div class="container text-center">
		Floating Projects Collective {dayjs().format('YYYY')}
	</div>
</div>

<style>
	.social {
		@apply w-8 mx-1;
	}
</style>