<script>
    import { db, auth } from '$lib/firebase.js';
    import { collection, getDocs, orderBy, query } from 'firebase/firestore';
    import { onAuthStateChanged } from 'firebase/auth';
    import { onMount } from 'svelte';

    let isAdmin = false;
    let loading = true;
    let posts = [];
    
    const ADMIN_EMAILS = ['fukkuen.work@gmail.com'];

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && ADMIN_EMAILS.includes(user.email)) {
                isAdmin = true;
                await loadPosts();
            } else {
                isAdmin = false;
                window.location.href = '/admin';
            }
            loading = false;
        });
        return unsubscribe;
    });

    async function loadPosts() {
        try {
            const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(postsQuery);
            posts = snap.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    formattedDate: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        hour: 'numeric', minute: '2-digit', hour12: true
                    }) : 'Unknown date'
                };
            });
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    }

    function truncateId(id) {
        return id.substring(0, 5) + '...';
    }
</script>

<div class="min-h-screen bg-[#181826] text-gray-200 py-8 px-6 sm:px-8 lg:px-10 font-sans">
    {#if loading}
        <div class="flex items-center justify-center h-full text-gray-400 mt-20">Loading...</div>
    {:else if isAdmin}
        <div class="max-w-[1400px] mx-auto">
            
            <!-- Header Section -->
            <div class="mb-8">
                <a href="/admin" class="text-sm text-[#7b79ff] hover:text-[#9b99ff] flex items-center gap-2 mb-4">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back
                </a>
                
                <div class="flex justify-between items-end">
                    <div>
                        <h1 class="text-[2rem] font-bold text-white mb-1">Post</h1>
                        <p class="text-sm text-gray-400">{posts.length} entries found</p>
                    </div>
                    <div>
                        <a href="/admin/posts/new" class="px-4 py-2 bg-[#4945ff] hover:bg-[#6663ff] text-white rounded text-sm font-medium shadow-sm transition flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            Create new entry
                        </a>
                    </div>
                </div>
            </div>

            <!-- Toolbar -->
            <div class="flex justify-between items-center mb-4">
                <div class="flex gap-2">
                    <button class="w-9 h-9 bg-[#212134] border border-[#4a4a6a] rounded flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                    <button class="px-4 h-9 bg-[#212134] border border-[#4a4a6a] rounded flex items-center gap-2 text-sm text-gray-300 hover:text-white hover:border-gray-500 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                        Filters
                    </button>
                </div>
                
                <div class="flex gap-2">
                    <button class="px-4 h-9 bg-[#212134] border border-[#4a4a6a] rounded flex items-center gap-2 text-sm text-gray-300 hover:text-white hover:border-gray-500 transition">
                        English (en)
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <button class="w-9 h-9 bg-[#212134] border border-[#4a4a6a] rounded flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM7.5 11.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0-7a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" /></svg>
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-[#212134] border border-[#4a4a6a] rounded-lg shadow-sm">
                <div class="overflow-x-auto w-full">
                    <table class="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr class="border-b border-[#4a4a6a] text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th class="p-4 w-12 text-center">
                                    <input type="checkbox" class="w-4 h-4 rounded border-gray-600 bg-[#32324d] focus:ring-[#7b79ff] focus:ring-offset-[#212134]" />
                                </th>
                                <th class="p-4 w-24">ID</th>
                                <th class="p-4">Title</th>
                                <th class="p-4 w-32">Authors</th>
                                <th class="p-4 w-56">CreatedAt</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm text-gray-300">
                            {#each posts as post}
                                <tr class="border-b border-[#4a4a6a] hover:bg-[#32324d] transition group cursor-pointer" on:click={() => window.location.href = `/admin/posts/${post.id}`}>
                                    <td class="p-4 text-center" on:click|stopPropagation>
                                        <input type="checkbox" class="w-4 h-4 rounded border-gray-600 bg-[#32324d] focus:ring-[#7b79ff] focus:ring-offset-[#32324d]" />
                                    </td>
                                    <td class="p-4 font-mono text-gray-400 truncate">{truncateId(post.id)}</td>
                                    <td class="p-4 truncate">
                                        <div class="font-medium text-white truncate" style="max-width: 300px;" title={post.title}>
                                            {post.title}
                                        </div>
                                    </td>
                                    <td class="p-4 truncate">
                                        <div class="inline-flex items-center gap-1 bg-[#32324d] border border-[#4a4a6a] px-2 py-1 rounded text-xs text-gray-300">
                                            <span class="font-bold text-white">{post.authors?.length || 0}</span>
                                            <span>item{post.authors?.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    </td>
                                    <td class="p-4 text-gray-400">{post.formattedDate}</td>
                                </tr>
                            {:else}
                                <tr>
                                    <td colspan="5" class="p-8 text-center text-gray-500">
                                        No entries found
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination Footer -->
                {#if posts.length > 0}
                    <div class="p-4 border-t border-[#4a4a6a] flex justify-between items-center text-sm text-gray-400">
                        <div class="flex items-center gap-2">
                            <span>10 per page</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        <div class="flex gap-1">
                            <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-[#32324d] transition disabled:opacity-50" disabled>
                                &lt;
                            </button>
                            <button class="w-8 h-8 flex items-center justify-center rounded bg-[#4945ff] text-white">
                                1
                            </button>
                            <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-[#32324d] transition disabled:opacity-50" disabled>
                                &gt;
                            </button>
                        </div>
                    </div>
                {/if}
            </div>

        </div>
    {/if}
</div>
