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
			href: '/'
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
<!--	<div class="text-center pt-4">-->
<!--		<a href="/" class="font-bold">Floating Projects</a>-->
<!--	</div>-->
	<div class="flex justify-center px-4 border-b border-gray-300">
		{#each menu as item}
			<a href="{item.href}" class="inline-flex flex-col items-center">
				<b>{item.title}</b>
				<span class="text-xs">{item.subtitle}</span>
			</a>
		{/each}
	</div>
</div>
<slot></slot>
<div class="bg-gray-100 text-gray-500 text-base border-t border-gray-300 pt-8">
	<div class="container py-12 text-center">
		Floating Projects Collective {dayjs().format('YYYY')}
	</div>
</div>

<style>
	a {
		@apply mx-2 p-2;
	}
</style>