<script>
	export let data
	import dayjs from "dayjs";
	import thumbs from '../../../lib/member-thumbs.json'
	$: member = data.member
	$: posts = data.posts.data
	$: events = data.events.data
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	$: a = member.attributes
	$: src = thumbs[a.slug]
		|| (a.image && a.image.data ? a.image.data.attributes.url : null)
		|| (a.wp_url ? VITE_IMAGE_BASE + a.wp_url : null)
</script>

<div class="container py-8">
	<a href="/collective/{a.slug}">
		{#if src}
			<img
				{src}
				alt={a.name}
				width="384"
				height="384"
				class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300 object-cover"/>
		{:else}
			<div class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300"></div>
		{/if}
	</a>
	<div class="max-w-md mx-auto mt-4">
		<p class="text-center text-2xl">{a.name}</p>
		{#if a.title}
			<p class="text-center">{a.title}</p>
		{/if}
		{#if a.external_url}
			<div class="text-center text-gray-500 underline my-2">
				<a href={a.external_url} target="_blank" rel="noopener noreferrer">{a.external_url}</a>
			</div>
		{/if}
		<p class="mt-4 leading-loose text-gray-600">{@html member.attributes.profile}</p>

		<div class="my-4">
			<h2 class="divider">文章</h2>
			<div class="grid grid-cols-1 gap-4 my-4">
				{#each posts as p}
					<a href="/art-notes/{p.attributes.slug}">
						<div>{p.attributes.title}</div>
						<div class="text-gray-600 text-sm">{dayjs(p.attributes.publishedAt).format('DD MMM YYYY')}</div>
					</a>
				{/each}
			</div>
			<a class="text-blue-800 text-sm underline" href="/author/{member.attributes.slug}/1">More</a>
		</div>
		<div class="my-4">
			<h2 class="divider">動向</h2>
			<div class="grid grid-cols-1 gap-4 my-4">
				{#each events as p}
					<a href="/events/{p.attributes.slug}">
						<div>{p.attributes.title}</div>
						<div class="text-gray-600 text-sm">{dayjs(p.attributes.publishedAt).format('DD MMM YYYY')}</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.divider {
		@apply flex items-center;
	}
	.divider:before, .divider:after {
		content: ' ';
		@apply h-[1px] flex-1 bg-gray-400 mx-2;
	}
</style>