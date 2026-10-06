<script>
    import { createEventDispatcher } from 'svelte';
    import { listMedia, uploadMedia } from '$lib/media.js';

    const dispatch = createEventDispatcher();

    let mode = 'browse'; // 'browse' | 'upload'

    let items = [];
    let lastDoc = null;
    let hasMore = true;
    let loading = false;
    let loadedOnce = false;

    let fileInput;
    let selectedFile = null;
    let previewUrl = null;
    let uploading = false;
    let uploadError = '';

    async function loadPage() {
        if (loading || !hasMore) return;
        loading = true;
        try {
            const { items: newItems, lastDoc: newLastDoc } = await listMedia({ after: lastDoc });
            items = [...items, ...newItems];
            lastDoc = newLastDoc;
            hasMore = newItems.length > 0;
        } catch (error) {
            console.error('Error loading media:', error);
        } finally {
            loading = false;
            loadedOnce = true;
        }
    }

    function switchMode(next) {
        mode = next;
        if (next === 'browse' && !loadedOnce) {
            loadPage();
        }
    }

    function onFileChange(e) {
        const file = e.target.files?.[0];
        uploadError = '';
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (file) {
            selectedFile = file;
            previewUrl = URL.createObjectURL(file);
        } else {
            selectedFile = null;
            previewUrl = null;
        }
    }

    async function doUpload() {
        if (!selectedFile) return;
        uploading = true;
        uploadError = '';
        try {
            const mediaDoc = await uploadMedia(selectedFile);
            select(mediaDoc);
        } catch (error) {
            console.error('Error uploading image:', error);
            uploadError = error.message || 'Upload failed.';
        } finally {
            uploading = false;
        }
    }

    function select(mediaDoc) {
        dispatch('select', mediaDoc);
        close();
    }

    function close() {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        dispatch('close');
    }

    loadPage();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div class="bg-[#212134] border border-gray-700 rounded-lg shadow-lg w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h2 class="text-white font-bold text-lg">Media Library</h2>
            <button type="button" class="text-gray-400 hover:text-white" on:click={close}>✕</button>
        </div>

        <div class="flex gap-2 px-6 pt-4">
            <button
                type="button"
                class="px-4 py-2 text-sm font-medium rounded-t border-b-2 transition"
                class:text-white={mode === 'browse'}
                class:border-[#4945ff]={mode === 'browse'}
                class:text-gray-400={mode !== 'browse'}
                class:border-transparent={mode !== 'browse'}
                on:click={() => switchMode('browse')}
            >
                Browse
            </button>
            <button
                type="button"
                class="px-4 py-2 text-sm font-medium rounded-t border-b-2 transition"
                class:text-white={mode === 'upload'}
                class:border-[#4945ff]={mode === 'upload'}
                class:text-gray-400={mode !== 'upload'}
                class:border-transparent={mode !== 'upload'}
                on:click={() => switchMode('upload')}
            >
                Upload new
            </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
            {#if mode === 'browse'}
                {#if items.length === 0 && !loading}
                    <p class="text-gray-400 text-sm">No images uploaded yet.</p>
                {:else}
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {#each items as item (item.id)}
                            <button
                                type="button"
                                class="aspect-square bg-[#32324d] rounded overflow-hidden border border-gray-600 hover:border-[#4945ff] transition"
                                on:click={() => select(item)}
                            >
                                <img src={item.thumbnailUrl} alt={item.filename} loading="lazy" class="w-full h-full object-cover" />
                            </button>
                        {/each}
                    </div>
                {/if}
                {#if hasMore}
                    <div class="flex justify-center mt-4">
                        <button
                            type="button"
                            class="px-4 py-2 bg-[#32324d] text-white text-sm rounded border border-gray-600 hover:bg-[#4a4a68] transition disabled:opacity-50"
                            disabled={loading}
                            on:click={loadPage}
                        >
                            {loading ? 'Loading...' : 'Load more'}
                        </button>
                    </div>
                {/if}
            {:else}
                <div class="space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        bind:this={fileInput}
                        on:change={onFileChange}
                        class="text-sm text-gray-300"
                    />
                    {#if previewUrl}
                        <img src={previewUrl} alt="Preview" class="max-h-64 rounded border border-gray-600" />
                    {/if}
                    {#if uploadError}
                        <p class="text-red-400 text-sm">{uploadError}</p>
                    {/if}
                    <button
                        type="button"
                        class="px-6 py-2 bg-[#4945ff] text-white rounded text-sm font-medium shadow-sm hover:bg-[#6663ff] transition disabled:opacity-50"
                        disabled={!selectedFile || uploading}
                        on:click={doUpload}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>
