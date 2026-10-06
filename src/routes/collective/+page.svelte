<script>
	import MemberPreview from "./MemberPreview.svelte";
	export let data
	$: collective = data.data

	const byOrder = (orderKey) => (a, b) => {
		const ao = a.attributes[orderKey] ?? Number.MAX_SAFE_INTEGER
		const bo = b.attributes[orderKey] ?? Number.MAX_SAFE_INTEGER
		return ao - bo || a.attributes.name.localeCompare(b.attributes.name)
	}

	$: active_members = collective
		.filter(c => c.attributes.active_player)
		.sort(byOrder('active_player_order'))
	$: founding_members = collective
		.filter(c => c.attributes.founding_member)
		.sort(byOrder('founding_member_order'))
	/* "and the rest" — everyone the two rosters above do not claim. The Overseas
	   Affiliate group is gone, so its members land here too. */
	$: friends = collective.filter(c => {
		const a = c.attributes
		return !a.active_player && !a.founding_member
	})
</script>

<div class="py-8">
	<div class="container">
		<p class="text-gray-700 mb-4 text-center pt-4 text-2xl">Active players</p>
		<div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
			{#each active_members as member}
				<MemberPreview {member}/>
			{/each}
		</div>
	</div>
</div>
<div class="bg-gray-100 border-t border-gray-200 py-8">
	<div class="container">
		<p class="text-gray-700 mb-4 text-center text-2xl">Friends of FP</p>
		<div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
			{#each friends as member}
				<MemberPreview {member}/>
			{/each}
		</div>
	</div>
</div>
<div class="py-8">
	<div class="container">
		<p class="text-gray-700 mb-4 text-center pt-4 text-2xl">Founding members</p>
		<div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
			{#each founding_members as member}
				<MemberPreview {member}/>
			{/each}
		</div>
	</div>
</div>
