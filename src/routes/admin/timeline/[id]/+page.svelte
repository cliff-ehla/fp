<script>
	import { auth } from '$lib/firebase.js';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		applyFp5Override,
		cloneFp5Seed,
		editableFields,
		fetchFp5Event,
		isAdminEmail,
		saveFp5Event
	} from '$lib/fp5.js';

	let isAdmin = false;
	let loading = true;
	let saving = false;
	let saveNote = '';
	let error = '';
	let missing = false;

	let title = '';
	let meta = '';
	let date = '';
	let short = '';
	let desc = '';

	$: id = $page.params.id;

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user && isAdminEmail(user.email)) {
				isAdmin = true;
				await loadCard();
			} else {
				isAdmin = false;
				window.location.href = '/admin';
			}
			loading = false;
		});
		return unsubscribe;
	});

	async function loadCard() {
		error = '';
		const seed = cloneFp5Seed();
		const base = seed[id];
		if (!base) {
			missing = true;
			return;
		}
		let remote = null;
		try {
			remote = await fetchFp5Event(id);
		} catch (e) {
			console.error(e);
		}
		const card = applyFp5Override(base, remote);
		const fields = editableFields(card);
		title = fields.title;
		meta = fields.meta;
		date = fields.date;
		short = fields.short;
		desc = fields.desc;
	}

	async function save() {
		saving = true;
		saveNote = '';
		error = '';
		try {
			await saveFp5Event(id, { title, meta, date, short, desc });
			saveNote = 'Saved. Public /timeline will show this after a refresh.';
		} catch (e) {
			error = e.message || String(e);
			console.error(e);
		} finally {
			saving = false;
		}
	}
</script>

<div class="min-h-screen bg-[#181826] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
	{#if loading}
		<div class="flex items-center justify-center h-full text-gray-400 mt-20">Loading...</div>
	{:else if isAdmin}
		<div class="max-w-3xl mx-auto">
			<a href="/admin/timeline" class="text-sm text-[#7b79ff] hover:text-[#9b99ff] flex items-center gap-2 mb-4">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
				All cards
			</a>

			{#if missing}
				<p class="text-red-400">Unknown card id: {id}</p>
			{:else}
				<h1 class="text-2xl font-bold text-white mb-1">{id}</h1>
				<p class="text-sm text-gray-400 mb-8">One Firebase document in <code class="text-gray-300">fp5_events/{id}</code></p>

				<form class="space-y-5" on:submit|preventDefault={save}>
					<label class="block">
						<span class="block text-xs font-bold text-gray-400 uppercase mb-2">Title</span>
						<input bind:value={title} class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm" />
					</label>
					<label class="block">
						<span class="block text-xs font-bold text-gray-400 uppercase mb-2">Date on card</span>
						<input bind:value={date} class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm" placeholder="Shown on the timeline card" />
					</label>
					<label class="block">
						<span class="block text-xs font-bold text-gray-400 uppercase mb-2">Short blurb on card</span>
						<input bind:value={short} class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm" />
					</label>
					<label class="block">
						<span class="block text-xs font-bold text-gray-400 uppercase mb-2">Date / meta in modal</span>
						<textarea bind:value={meta} rows="2" class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm"></textarea>
						<span class="text-xs text-gray-500">Can include simple HTML such as &lt;b&gt;…&lt;/b&gt;</span>
					</label>
					<label class="block">
						<span class="block text-xs font-bold text-gray-400 uppercase mb-2">Description</span>
						<textarea bind:value={desc} rows="12" class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm leading-relaxed"></textarea>
						<span class="text-xs text-gray-500">Blank line between paragraphs. HTML lists are ok.</span>
					</label>

					{#if saveNote}
						<p class="text-sm text-green-400">{saveNote}</p>
					{/if}
					{#if error}
						<p class="text-sm text-red-400">{error}</p>
					{/if}

					<div class="flex gap-3">
						<button type="submit" disabled={saving} class="px-4 py-2 bg-[#4945ff] hover:bg-[#6663ff] text-white rounded text-sm font-medium disabled:opacity-50">
							{saving ? 'Saving…' : 'Save'}
						</button>
						<a href="/timeline" target="_blank" rel="noreferrer" class="px-4 py-2 border border-gray-600 rounded text-sm text-gray-300 hover:text-white">
							View timeline
						</a>
					</div>
				</form>
			{/if}
		</div>
	{/if}
</div>
