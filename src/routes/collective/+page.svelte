<script>
	import MemberPreview from "./MemberPreview.svelte";
	export let data
	$: collective = data.data

	/* Rosters as confirmed by Linda, Sept 2026. Matched on slug rather than on
	   display name, so renaming someone in the CMS cannot quietly drop them out
	   of a group the way the old name-substring matching could. Each list is
	   also the display order. */
	const active_player_slugs = [
		'linda',         // Linda Chiu-han Lai 黎肖嫻
		'fkwong',        // WONG Fuk-kuen 黃福權
		'andiolai',      // LAI Chung-man Andio 黎仲民
		'hugoyeung',     // Hugo Yeung 楊鳴謙
		'andy-li',       // Andy Li 李新傑
		'michael-leung', // Michael Leung 梁志剛
		'kinchoi',       // Kin-choi Lam 林建才
		'stanley-ng',    // NG Sing-yiu Stanley 伍昇耀
		'kel',           // Kel Lok 駱敏聰
		'hector',        // Hector Rodriguez 羅海德 — needs is_member set on his record
		'lau-ho-chi',    // LAU Ho-chi 劉浩知
		'wai'            // LAI Wai-leung 黎偉亮
	]
	const founding_member_slugs = [
		'linda',          // Linda Chiu-han Lai 黎肖嫻
		'cheung-yu-tsz',  // CHEUNG Yu-tsz 張妤子
		'lilianfu',       // Lilian Fu 傅詠恩
		'jolene-mok'      // Jolene MOK 莫頌靈
	]

	const inRosterOrder = (list, slugs) => slugs
		.map(slug => list.find(c => c.attributes.slug === slug))
		.filter(Boolean)

	$: active_members = inRosterOrder(collective, active_player_slugs)
	$: founding_members = inRosterOrder(collective, founding_member_slugs)
	/* "and the rest" — everyone the two rosters above do not claim. The Overseas
	   Affiliate group is gone, so its members land here too. */
	$: friends = collective.filter(c => {
		const slug = c.attributes.slug
		return !active_player_slugs.includes(slug) && !founding_member_slugs.includes(slug)
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
