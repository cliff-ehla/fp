<script>
    import { auth } from '$lib/firebase.js';
    import { onAuthStateChanged } from 'firebase/auth';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import PostForm from '$lib/components/PostForm.svelte';
    
    let isAdmin = false;
    let loading = true;
    const ADMIN_EMAILS = ['fukkuen.work@gmail.com'];
    
    $: postId = $page.params.id;

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && ADMIN_EMAILS.includes(user.email)) {
                isAdmin = true;
            } else {
                isAdmin = false;
                window.location.href = '/admin';
            }
            loading = false;
        });
        return unsubscribe;
    });
</script>

<div class="min-h-screen bg-[#181826] text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
    {#if loading}
        <div class="flex items-center justify-center h-full text-gray-400 mt-20">Loading...</div>
    {:else if isAdmin}
        <div class="max-w-[1200px] mx-auto">
            <PostForm {postId} />
        </div>
    {/if}
</div>
