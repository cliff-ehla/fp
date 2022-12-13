<script>
	export let data
	import dayjs from "dayjs";
	$: member = data.member
	$: posts = data.posts.data
	$: events = data.events.data
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
</script>

<div class="container py-8">
	<a href="/collective/{member.attributes.slug}">
		{#if member.attributes.image.data}
			<div style="background-image: url({member.attributes.image.data.attributes.url})"
			     class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300 bg-center bg-cover"></div>
		{:else if member.attributes.wp_url}
			<div style="background-image: url({VITE_IMAGE_BASE}{member.attributes.wp_url})"
			     class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300 bg-center bg-cover"></div>
		{:else}
			<div class="rounded-full shadow-lg mx-auto w-48 h-48 bg-gray-100 border-8 border-gray-300"></div>
		{/if}
	</a>
	<div class="max-w-md mx-auto mt-4">
		<p class="text-center text-2xl">{member.attributes.name}</p>
		{#if member.attributes.title}
			<p class="text-center">{member.attributes.title}</p>
		{/if}
		<div class="text-center text-gray-500 underline my-2">
			<a href={member.attributes.external_url} target="_blank">{member.attributes.external_url}</a>
		</div>
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