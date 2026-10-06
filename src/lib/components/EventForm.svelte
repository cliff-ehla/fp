<script>
    import { db } from '$lib/firebase.js';
    import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, getDocs } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import 'quill/dist/quill.snow.css';
    import RelationSelect from '$lib/components/RelationSelect.svelte';
    import MediaLibraryModal from '$lib/components/MediaLibraryModal.svelte';

    export let eventId = null;

    // Form fields
    let title = '';
    let excerpt = '';
    let slug = '';
    let content = '';
    let mainImage = '';
    let eventDate = '';
    let endDate = '';
    let location = '';
    let isSubmitting = false;
    let loadingData = !!eventId;
    let quill;
    let quillRange = null;

    let showCoverPicker = false;
    let showQuillImagePicker = false;

    // Collections data
    let dbCategories = [];

    // Selected relationships
    let selectedCategoryArray = [];

    function editorAction(node) {
        import('quill').then(({ default: Quill }) => {
            quill = new Quill(node, {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'align': [] }],
                            ['link', 'image', 'video'],
                            ['clean']
                        ],
                        handlers: {
                            image: function () {
                                quillRange = this.quill.getSelection(true);
                                showQuillImagePicker = true;
                            }
                        }
                    }
                }
            });
            quill.on('text-change', () => {
                content = quill.root.innerHTML;
            });
            if (content) {
                quill.clipboard.dangerouslyPasteHTML(content);
            }
        });
        return {
            destroy() {
                if (quill) {
                    quill = null;
                }
            }
        };
    }

    onMount(async () => {
        await Promise.all([
            loadDropdownData(),
            eventId ? loadEventData() : Promise.resolve()
        ]);
    });

    async function loadDropdownData() {
        try {
            const catsSnap = await getDocs(collection(db, 'categories'));
            dbCategories = catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error loading dropdown data:", error);
        }
    }

    async function loadEventData() {
        try {
            const eventRef = doc(db, 'events', eventId);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) {
                const data = eventSnap.data();
                title = data.title || '';
                excerpt = data.excerpt || '';
                slug = data.slug || '';
                content = data.content || '';
                mainImage = data.mainImage || '';
                eventDate = data.eventDate || '';
                endDate = data.endDate || '';
                location = data.location || '';

                if (data.categories) {
                    selectedCategoryArray = data.categories.map(c => typeof c === 'object' ? String(c.id || c._id) : String(c));
                } else if (data.category && (data.category.id || data.category._id || typeof data.category === 'string')) {
                    selectedCategoryArray = [typeof data.category === 'object' ? String(data.category.id || data.category._id) : String(data.category)];
                }

                if (quill) {
                    quill.clipboard.dangerouslyPasteHTML(content);
                }
            }
        } catch (error) {
            console.error("Error loading event data:", error);
        } finally {
            loadingData = false;
        }
    }

    const saveEvent = async () => {
        if (!title || !slug) {
            alert('Title and Slug are required!');
            return;
        }

        isSubmitting = true;
        try {
            const categories = selectedCategoryArray.map(id => {
                const c = dbCategories.find(x => x.id === id);
                return c ? { id: c.id, name: c.name, slug: c.slug } : null;
            }).filter(Boolean);
            const category = categories.length > 0 ? categories[0] : null;

            const eventData = {
                title,
                slug,
                excerpt,
                content,
                mainImage,
                eventDate,
                endDate,
                location,
                updatedAt: serverTimestamp(),
                category,
                categories
            };

            if (eventId) {
                await updateDoc(doc(db, 'events', eventId), eventData);
                alert('Event updated successfully!');
            } else {
                eventData.createdAt = serverTimestamp();
                eventData.publishedAt = serverTimestamp();
                const newDocRef = await addDoc(collection(db, 'events'), eventData);
                alert('Event created successfully!');
                eventId = newDocRef.id;
            }
            window.location.href = '/admin/events';
        } catch (error) {
            console.error("Error saving event: ", error);
            alert("Error saving event: " + error.message);
        } finally {
            isSubmitting = false;
        }
    };
</script>

{#if loadingData}
    <div class="flex items-center justify-center h-full text-gray-400 mt-20">Loading event data...</div>
{:else}
<form on:submit|preventDefault={saveEvent}>
    <div class="flex justify-between items-center mb-8">
        <div>
            <a href="/admin/events" class="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-2">
                ← Back
            </a>
            <h1 class="text-3xl font-bold text-white mb-1">{eventId ? 'Edit entry' : 'Create an entry'}</h1>
            <p class="text-sm text-gray-400">API ID : event</p>
        </div>
        <div class="flex gap-4">
            <button type="button" class="px-4 py-2 bg-[#212134] text-white border border-gray-600 rounded hover:bg-[#32324d] transition text-sm font-medium shadow-sm">
                Unpublish
            </button>
            <button type="submit" disabled={isSubmitting} class="px-6 py-2 bg-[#4945ff] text-white rounded text-sm font-medium shadow-sm hover:bg-[#6663ff] transition disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save'}
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-[#212134] rounded-lg p-6 border border-gray-700 shadow-sm">
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">title<span class="text-red-400 ml-1">*</span></label>
                        <input type="text" bind:value={title} required class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm focus:border-[#4945ff] focus:ring-1 focus:ring-[#4945ff] outline-none transition" />
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">excerpt</label>
                        <textarea bind:value={excerpt} rows="3" class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm focus:border-[#4945ff] focus:ring-1 focus:ring-[#4945ff] outline-none transition"></textarea>
                    </div>
                </div>

                <div class="mb-6 quill-dark">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">content</label>
                    <div class="bg-[#32324d] rounded border border-gray-600 text-white overflow-hidden text-sm">
                        <div use:editorAction class="min-h-[400px]"></div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">slug<span class="text-red-400 ml-1">*</span></label>
                        <input type="text" bind:value={slug} required class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm focus:border-[#4945ff] focus:ring-1 focus:ring-[#4945ff] outline-none transition" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">cover image</label>
                        {#if mainImage}
                            <img src={mainImage} alt="" class="w-full h-32 object-cover rounded border border-gray-600 mb-2" />
                        {/if}
                        <button
                            type="button"
                            class="px-4 py-2 bg-[#32324d] text-white border border-gray-600 rounded hover:bg-[#4a4a68] transition text-sm font-medium"
                            on:click={() => showCoverPicker = true}
                        >
                            Choose image
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
            <div class="bg-[#212134] rounded-lg p-6 border border-gray-700 shadow-sm">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Details</h3>

                <div class="space-y-6">
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">start date</label>
                        <input type="date" bind:value={eventDate} class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm focus:border-[#4945ff] focus:ring-1 focus:ring-[#4945ff] outline-none transition" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">end date</label>
                        <input type="date" bind:value={endDate} class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm focus:border-[#4945ff] focus:ring-1 focus:ring-[#4945ff] outline-none transition" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">location</label>
                        <input type="text" bind:value={location} class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm focus:border-[#4945ff] focus:ring-1 focus:ring-[#4945ff] outline-none transition" />
                    </div>

                    <RelationSelect
                        label="categories"
                        options={dbCategories.map(c => ({ id: c.id, label: c.name || c.slug }))}
                        bind:selectedIds={selectedCategoryArray}
                    />
                </div>
            </div>
        </div>
    </div>
</form>

{#if showCoverPicker}
    <MediaLibraryModal
        on:select={(e) => { mainImage = e.detail.url; showCoverPicker = false; }}
        on:close={() => showCoverPicker = false}
    />
{/if}

{#if showQuillImagePicker}
    <MediaLibraryModal
        on:select={(e) => {
            const index = quillRange ? quillRange.index : quill.getLength();
            quill.insertEmbed(index, 'image', e.detail.url);
            quill.setSelection(index + 1);
            showQuillImagePicker = false;
        }}
        on:close={() => showQuillImagePicker = false}
    />
{/if}
{/if}

<style>
    /* Basic dark mode overrides for Quill toolbar */
    :global(.quill-dark .ql-toolbar) {
        background-color: #212134;
        border-color: #4a4a68 !important;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }
    :global(.quill-dark .ql-container) {
        border-color: #4a4a68 !important;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    :global(.quill-dark .ql-stroke) {
        stroke: #c0c0cf !important;
    }
    :global(.quill-dark .ql-fill) {
        fill: #c0c0cf !important;
    }
    :global(.quill-dark .ql-picker) {
        color: #c0c0cf !important;
    }
    :global(.quill-dark .ql-picker-options) {
        background-color: #212134 !important;
        border-color: #4a4a68 !important;
    }
    :global(.quill-dark .ql-editor.ql-blank::before) {
        color: #666687 !important;
    }
</style>
