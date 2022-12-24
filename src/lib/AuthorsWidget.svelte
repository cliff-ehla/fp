<script>
	export let createdAt
	export let authors
	import dayjs from "dayjs";
</script>

{#if authors.length === 1}
	<a href="/author/{authors[0].attributes.slug}/1" class="my-4 flex items-center text-gray-800">
		<div class="w-12 h-12 rounded-full bg-gray-100 border border-gray-400"></div>
		<div class="ml-2">
			<p class="leading-tight">{authors[0].attributes.name}</p>
			<p class="text-xs leading-tight">發表於: {dayjs(createdAt).format('DD MMM YYYY')}</p>
		</div>
	</a>
{:else if authors.length > 1}
	<div class="flex my-4 items-center">
		{#each authors as a, i}
			<div class="{i > 0 ? '-ml-6' : ''} w-12 h-12 rounded-full bg-gray-100 border border-gray-400"></div>
		{/each}
		<div class="ml-2">
			<div class="flex items-center">
				{#each authors as a, i}
				<span class="leading-none">
					<a href="/author/{a.attributes.slug}/1" class="text-sm text-gray-800" class:ml-2={i > 0}>
						{a.attributes.name}
					</a>
				</span>
				{/each}
			</div>
			<div class="text-xs leading-tight">發表於: {dayjs(createdAt).format('DD MMM YYYY')}</div>
		</div>
	</div>
{/if}