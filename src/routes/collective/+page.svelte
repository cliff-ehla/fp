<script>
	import dayjs from 'dayjs'
	import MemberPreview from "./MemberPreview.svelte";
	const VITE_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE
	export let data
	$: collective = data.data
	$: past_members = collective.filter(c => {
		return dayjs(c.attributes.membership_end).isBefore(dayjs()) && !c.attributes.oversea_affiliate
	}).sort((a,b) => {
		return (a.attributes.founding_member && !b.attributes.founding_member) ? -1 : 1
	})
	$: oversea_members = collective.filter(c => {
		return c.attributes.oversea_affiliate
	})
	$: active_members = collective.filter(c => {
		return !c.attributes.membership_end && !c.attributes.oversea_affiliate
	}).sort((a,b) => {
		return dayjs(a.attributes.membership_start).isAfter(dayjs(b.attributes.membership_start)) ? 1 : -1
	})
</script>

<div class="py-8">
	<div class="container">
		<p class="text-gray-700 mb-4 text-center pt-4 text-2xl">Current members</p>
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
		<p class="text-gray-700 mb-4 text-center text-2xl">Past members</p>
		<div class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-4">
			{#each past_members as member}
				<MemberPreview {member}/>
			{/each}
		</div>
	</div>
</div>