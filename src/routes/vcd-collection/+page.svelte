<script>
	export let data
	const items = data.data.map(d => d.attributes)

	let search = ''

	$: filtered = items.filter(p => {
		if (!search) return true
		const q = search.toLowerCase()
		const haystack = `${p.index} ${p.titleChinese} ${p.titleEnglish} ${p.year} ${p.dirChinese} ${p.dirEnglish} ${p.notes}`.toLowerCase()
		return haystack.includes(q)
	})
</script>

<div class="container py-8 px-4">
	<h1 class="text-2xl font-bold mb-1">VCD Collection</h1>
	<p class="text-sm text-gray-500 mb-6">{items.length} titles in the collection.</p>

	<div class="mb-6">
		<input
			class="border border-gray-300 rounded px-2 py-1 text-sm w-full max-w-sm"
			type="text"
			placeholder="Search title, director, year..."
			bind:value={search}
		/>
	</div>

	<p class="text-xs text-gray-400 mb-3">Showing {filtered.length} of {items.length}</p>

	<div class="overflow-x-auto">
		<table class="w-full text-sm border-collapse">
			<thead>
				<tr class="text-left border-b border-gray-300">
					<th class="py-2 pr-3 whitespace-nowrap">Index</th>
					<th class="py-2 pr-3">Title (Chinese)</th>
					<th class="py-2 pr-3">Title (English)</th>
					<th class="py-2 pr-3 whitespace-nowrap">Year</th>
					<th class="py-2 pr-3">Director (Chinese)</th>
					<th class="py-2 pr-3">Director (English)</th>
					<th class="py-2 pr-3">Notes</th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as p (p.num)}
					<tr class="border-b border-gray-100 align-top">
						<td class="py-2 pr-3 whitespace-nowrap font-mono text-xs text-gray-500">{p.index}</td>
						<td class="py-2 pr-3">{p.titleChinese}</td>
						<td class="py-2 pr-3">{p.titleEnglish}</td>
						<td class="py-2 pr-3 whitespace-nowrap">{p.year}</td>
						<td class="py-2 pr-3">{p.dirChinese}</td>
						<td class="py-2 pr-3">{p.dirEnglish}</td>
						<td class="py-2 pr-3 text-gray-500">{p.notes}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
