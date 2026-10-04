<script>
	import { auth } from '$lib/firebase.js';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { cloneFp5Seed, fetchFp5Events, isAdminEmail, mergeFp5Data, seedFp5EventsIfEmpty } from '$lib/fp5.js';

	let isAdmin = false;
	let loading = true;
	let seeding = false;
	let seedNote = '';
	let error = '';
	let cards = [];

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user && isAdminEmail(user.email)) {
				isAdmin = true;
				await loadCards();
			} else {
				isAdmin = false;
				window.location.href = '/admin';
			}
			loading = false;
		});
		return unsubscribe;
	});

	async function loadCards() {
		error = '';
		try {
			const seed = cloneFp5Seed();
			let remote = {};
			try {
				remote = await fetchFp5Events();
			} catch (e) {
				error = 'Could not load Firestore cards. Check fp5_events rules are deployed.';
				console.error(e);
			}
			const merged = mergeFp5Data(seed, remote);
			cards = Object.keys(merged).map((id) => ({
				id,
				title: merged[id].title,
				date: merged[id].date || merged[id].meta,
				inFirebase: !!remote[id]
			}));
		} catch (e) {
			error = e.message || String(e);
		}
	}

	async function seedMissing() {
		seeding = true;
		seedNote = '';
		error = '';
		try {
			const result = await seedFp5EventsIfEmpty();
			seedNote = result.seeded
				? `Wrote ${result.seeded} new cards to Firebase.`
				: 'All cards are already in Firebase.';
			await loadCards();
		} catch (e) {
			error = e.message || String(e);
			console.error(e);
		} finally {
			seeding = false;
		}
	}
</script>

<div class="min-h-screen bg-[#181826] text-gray-200 py-8 px-6 sm:px-8 lg:px-10 font-sans">
	{#if loading}
		<div class="flex items-center justify-center h-full text-gray-400 mt-20">Loading...</div>
	{:else if isAdmin}
		<div class="max-w-[1100px] mx-auto">
			<a href="/admin" class="text-sm text-[#7b79ff] hover:text-[#9b99ff] flex items-center gap-2 mb-4">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
				Back
			</a>

			<div class="flex justify-between items-end mb-6 gap-4 flex-wrap">
				<div>
					<h1 class="text-[2rem] font-bold text-white mb-1">FP5 Timeline</h1>
					<p class="text-sm text-gray-400">{cards.length} cards · separate from Events</p>
				</div>
				<button
					class="px-4 py-2 bg-[#4945ff] hover:bg-[#6663ff] text-white rounded text-sm font-medium disabled:opacity-50"
					disabled={seeding}
					on:click={seedMissing}
				>
					{seeding ? 'Writing…' : 'Seed missing cards'}
				</button>
			</div>

			<p class="text-sm text-gray-400 mb-4">
				Each row is one timeline card and one Firebase document. Layout stays on the public map; this form only edits titles, dates, and copy.
			</p>

			{#if seedNote}
				<p class="text-sm text-green-400 mb-4">{seedNote}</p>
			{/if}
			{#if error}
				<p class="text-sm text-red-400 mb-4">{error}</p>
			{/if}

			<div class="bg-[#212134] border border-[#4a4a6a] rounded-lg shadow-sm overflow-hidden">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="border-b border-[#4a4a6a] text-xs font-bold text-gray-400 uppercase tracking-wider">
							<th class="p-4 w-40">ID</th>
							<th class="p-4">Title</th>
							<th class="p-4">Date line</th>
							<th class="p-4 w-28">Firebase</th>
						</tr>
					</thead>
					<tbody class="text-sm text-gray-300">
						{#each cards as card}
							<tr
								class="border-b border-[#4a4a6a] hover:bg-[#32324d] transition cursor-pointer"
								on:click={() => (window.location.href = `/admin/timeline/${card.id}`)}
							>
								<td class="p-4 font-mono text-gray-400">{card.id}</td>
								<td class="p-4 text-white">{card.title}</td>
								<td class="p-4 text-gray-400 text-xs">{card.date}</td>
								<td class="p-4">{card.inFirebase ? 'saved' : 'seed only'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
