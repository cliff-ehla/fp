<script>
	import {goto} from "$app/navigation";

	export let data
	import {onMount} from "svelte";
	import {gsap} from "gsap";
	import dayjs from "dayjs";
	let logo
	let latest_blog = data.data
	let title_el
	let search_key
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
			duration: 1,
			ease: "power1.in"
		}).to(".animate-item", {
			x: 0,
			autoAlpha: 1,
			stagger: 0.15
		})
	})
	const onSubmit = (e) => {
		e.preventDefault()
		goto(`/search?q=${search_key}`)
	}
</script>
<div class="pt-12 pb-2">
	<img bind:this={logo} src="/fp-logo.png" alt="logo" class="w-72 mx-auto opacity-0">
</div>
<div class="flex justify-center my-12">
	<form on:submit={onSubmit} class="inline-flex border-2 border-gray-400">
		<input class="text-xl px-4 py-2" type="text" placeholder="Search..." bind:value={search_key}/>
		<button class="px-4" type="submit">
			<img class="w-4 h-4" src="/search.png" alt="search">
		</button>
	</form>
</div>
<div class="max-w-screen-sm mx-auto">
	<div class="py-4 px-8">
		<p bind:this={title_el} class="animate-item mb-2">最新文章/ Latest</p>
		{#each latest_blog as p}
			<a href="/art-notes/{p.attributes.slug}" class="block animate-item opacity-0 py-2 text-gray-500">
				<p class="text-xs">{dayjs(p.attributes.createdAt).format('DD MMM YYYY')}</p>
				<p>{p.attributes.title}</p>
			</a>
		{/each}
	</div>
</div>