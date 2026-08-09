<script>
    import { db, auth } from '$lib/firebase.js';
    import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, getDocs } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import 'quill/dist/quill.snow.css';
    import RelationSelect from '$lib/components/RelationSelect.svelte';

    export let postId = null;
    
    // Form fields
    let title = '';
    let excerpt = '';
    let slug = '';
    let content = '';
    let mainImage = '';
    let isSubmitting = false;
    let loadingData = !!postId;
    let quill;

    // Collections data
    let dbAuthors = [];
    let dbTags = [];
    let dbCategories = [];
    let dbEvents = [];
    let dbPosts = [];

    // Selected relationships
    let selectedAuthors = [];
    let selectedTags = [];
    let selectedCategoryArray = [];
    let selectedEvents = [];
    let selectedRelatedPosts = [];

    function editorAction(node) {
        import('quill').then(({ default: Quill }) => {
            quill = new Quill(node, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ]
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
            postId ? loadPostData() : Promise.resolve()
        ]);
    });

    async function loadDropdownData() {
        try {
            const [authorsSnap, tagsSnap, catsSnap, eventsSnap, postsSnap] = await Promise.all([
                getDocs(collection(db, 'authors')),
                getDocs(collection(db, 'tags')),
                getDocs(collection(db, 'categories')),
                getDocs(collection(db, 'events')),
                getDocs(collection(db, 'posts'))
            ]);

            dbAuthors = authorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            dbTags = tagsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            dbCategories = catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            dbEvents = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            dbPosts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error loading dropdown data:", error);
        }
    }

    async function loadPostData() {
        try {
            const postRef = doc(db, 'posts', postId);
            const postSnap = await getDoc(postRef);
            if (postSnap.exists()) {
                const data = postSnap.data();
                title = data.title || '';
                excerpt = data.excerpt || '';
                slug = data.slug || '';
                content = data.content || '';
                mainImage = data.mainImage || '';
                
                selectedAuthors = (data.authors || []).map(a => typeof a === 'object' ? String(a.id || a._id) : String(a));
                selectedTags = (data.tags || []).map(t => typeof t === 'object' ? String(t.id || t._id) : String(t));
                selectedEvents = (data.events || []).map(e => typeof e === 'object' ? String(e.id || e._id) : String(e));
                selectedRelatedPosts = (data.related_posts || []).map(p => typeof p === 'object' ? String(p.id || p._id) : String(p));
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
            console.error("Error loading post data:", error);
        } finally {
            loadingData = false;
        }
    }

    const savePost = async () => {
        if (!title || !slug) {
            alert('Title and Slug are required!');
            return;
        }

        isSubmitting = true;
        try {
            const authors = selectedAuthors.map(id => {
                const a = dbAuthors.find(x => x.id === id);
                return a ? { id: a.id, name: a.name, slug: a.slug, image: a.image || '' } : null;
            }).filter(Boolean);

            const tags = selectedTags.map(id => {
                const t = dbTags.find(x => x.id === id);
                return t ? { id: t.id, name: t.name, slug: t.slug } : null;
            }).filter(Boolean);

            const events = selectedEvents.map(id => {
                const e = dbEvents.find(x => x.id === id);
                return e ? { id: e.id, title: e.title, slug: e.slug, mainImage: e.mainImage || '' } : null;
            }).filter(Boolean);

            const related_posts = selectedRelatedPosts.map(id => {
                const p = dbPosts.find(x => x.id === id);
                return p ? { id: p.id, title: p.title, slug: p.slug } : null;
            }).filter(Boolean);

            const categories = selectedCategoryArray.map(id => {
                const c = dbCategories.find(x => x.id === id);
                return c ? { id: c.id, name: c.name, slug: c.slug } : null;
            }).filter(Boolean);
            const category = categories.length > 0 ? categories[0] : null;

            const postData = {
                title,
                slug,
                excerpt,
                content,
                mainImage,
                updatedAt: serverTimestamp(),
                category,
                categories,
                authors,
                tags,
                events,
                related_posts,
                author_slugs: authors.map(a => a.slug).filter(Boolean),
                tag_slugs: tags.map(t => t.slug).filter(Boolean)
            };

            if (postId) {
                await updateDoc(doc(db, 'posts', postId), postData);
                alert('Post updated successfully!');
            } else {
                postData.createdAt = serverTimestamp();
                postData.publishedAt = serverTimestamp();
                const newDocRef = await addDoc(collection(db, 'posts'), postData);
                alert('Post created successfully!');
                postId = newDocRef.id;
            }
            window.location.href = '/admin/posts';
        } catch (error) {
            console.error("Error saving post: ", error);
            alert("Error saving post: " + error.message);
        } finally {
            isSubmitting = false;
        }
    };
</script>

{#if loadingData}
    <div class="flex items-center justify-center h-full text-gray-400 mt-20">Loading post data...</div>
{:else}
<form on:submit|preventDefault={savePost}>
    <div class="flex justify-between items-center mb-8">
        <div>
            <a href="/admin/posts" class="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-2">
                ← Back
            </a>
            <h1 class="text-3xl font-bold text-white mb-1">{postId ? 'Edit entry' : 'Create an entry'}</h1>
            <p class="text-sm text-gray-400">API ID : post</p>
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
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">image URL</label>
                        <input type="text" bind:value={mainImage} class="w-full bg-[#32324d] text-white border border-gray-600 rounded p-2.5 text-sm focus:border-[#4945ff] focus:ring-1 focus:ring-[#4945ff] outline-none transition" placeholder="Upload via library soon..." />
                    </div>
                </div>
            </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
            <div class="bg-[#212134] rounded-lg p-6 border border-gray-700 shadow-sm">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Relations</h3>
                
                <div class="space-y-6">
                    <RelationSelect 
                        label="categories" 
                        options={dbCategories.map(c => ({ id: c.id, label: c.name || c.slug }))} 
                        bind:selectedIds={selectedCategoryArray} 
                    />

                    <RelationSelect 
                        label="authors" 
                        options={dbAuthors.map(a => ({ id: a.id, label: a.name }))} 
                        bind:selectedIds={selectedAuthors} 
                    />

                    <RelationSelect 
                        label="tags" 
                        options={dbTags.map(t => ({ id: t.id, label: t.name || t.slug }))} 
                        bind:selectedIds={selectedTags} 
                    />

                    <RelationSelect 
                        label="events" 
                        options={dbEvents.map(e => ({ id: e.id, label: e.title }))} 
                        bind:selectedIds={selectedEvents} 
                    />

                    <RelationSelect 
                        label="related_posts" 
                        options={dbPosts.map(p => ({ id: p.id, label: p.title }))} 
                        bind:selectedIds={selectedRelatedPosts} 
                    />
                </div>
            </div>
        </div>
    </div>
</form>
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
