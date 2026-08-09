<script>
	import dayjs from 'dayjs'
	import MemberPreview from "./MemberPreview.svelte";
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	export let data
	$: collective = data.data
	const founding_member_names = ['lilian fu', 'jolene', 'yuchi', 'linda']
	const friends_of_fp_names = ['john', 'michael', 'emily', 'winsome', 'martha', 'dory']
	$: past_members = collective.filter(c => {
		const name = (c.attributes.name || '').toLowerCase()
		return (dayjs(c.attributes.membership_end).isBefore(dayjs()) || friends_of_fp_names.some(n => name.includes(n)))
			&& !c.attributes.oversea_affiliate
	}).sort((a,b) => {
		return (a.attributes.founding_member && !b.attributes.founding_member) ? -1 : 1
	})
	$: oversea_members = collective.filter(c => {
		return c.attributes.oversea_affiliate
	})
	$: founding_members = collective.filter(c => {
		const name = (c.attributes.name || '').toLowerCase()
		return founding_member_names.some(n => name.includes(n))
	})
	$: active_members = collective.filter(c => {
		const name = (c.attributes.name || '').toLowerCase()
		return !c.attributes.membership_end && !c.attributes.oversea_affiliate
			&& !founding_member_names.some(n => name.includes(n))
			&& !friends_of_fp_names.some(n => name.includes(n))
	}).sort((a,b) => {
		return dayjs(a.attributes.membership_start).isAfter(dayjs(b.attributes.membership_start)) ? 1 : -1
	})
</script>

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
<div class="py-8">
	<div class="container">
		<p class="text-gray-700 mb-4 text-center pt-4 text-2xl">Overseas Affiliate</p>
		<div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
			{#each oversea_members as member}
				<MemberPreview {member}/>
			{/each}
		</div>
	</div>
</div>
<div class="bg-gray-100 border-t border-gray-200 py-8">
	<div class="container">
		<p class="text-gray-700 mb-4 text-center text-2xl">Friends of FP</p>
		<div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
			{#each past_members as member}
				<MemberPreview {member}/>
			{/each}
		</div>
	</div>
</div>