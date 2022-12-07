<script>
	export let data
	import {onMount} from "svelte";
	import {gsap} from "gsap";
	import dayjs from "dayjs";
	let logo
	let latest_blog = data.data
	onMount(() => {
		gsap.set(logo, {
			autoAlpha: 0,
			y: 50
		})
		gsap.set(".animate-item", {
			autoAlpha: 0,
			x: -20
		})
		gsap.timeline().to(logo, {
			y: 0,
			autoAlpha: 1,
			duration: 1.2,
			ease: "power1.in"
		}).to(".animate-item", {
			x: 0,
			autoAlpha: 1,
			stagger: 0.2
		})
	})
</script>
<div class="pt-12 pb-2">
	<img bind:this={logo} src="/fp-logo.png" alt="logo" class="w-72 mx-auto">
</div>

<div class="p-4">
	{#each latest_blog as p}
		<a href="/art-notes/{p.id}" class="block animate-item px-4 py-2 text-gray-500">
			<p class="text-xs">{dayjs(p.createdAt).format('DD MMM YYYY')}</p>
			<p>{p.attributes.title}</p>
		</a>
	{/each}
</div>