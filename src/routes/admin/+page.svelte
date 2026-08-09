<script>
    import { onMount } from 'svelte';
    import { auth, googleProvider, signInWithPopup, signOut } from '../../lib/firebase.js';
    import { onAuthStateChanged } from 'firebase/auth';

    let user = null;
    let isAdmin = false;
    let loading = true;

    // Hardcode the admin emails here
    const ADMIN_EMAILS = [
        'fukkuen.work@gmail.com',
    ];

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            user = currentUser;
            if (user && ADMIN_EMAILS.includes(user.email)) {
                isAdmin = true;
            } else {
                isAdmin = false;
            }
            loading = false;
        });

        return unsubscribe;
    });

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed: " + error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    {#if loading}
        <div class="text-center text-gray-500">Loading...</div>
    {:else if !user}
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Admin Area
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Please sign in with Google to continue
            </p>
            <div class="mt-8 flex justify-center">
                <button on:click={login} class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Sign in with Google
                </button>
            </div>
        </div>
    {:else if !isAdmin}
        <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <h2 class="mt-6 text-3xl font-extrabold text-red-600">
                Access Denied
            </h2>
            <p class="mt-2 text-sm text-gray-600">
                Your email ({user.email}) is not authorized to access the admin area.
            </p>
            <div class="mt-8 flex justify-center">
                <button on:click={logout} class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                    Sign out
                </button>
            </div>
        </div>
    {:else}
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-600">Logged in as {user.email}</span>
                    <button on:click={logout} class="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300">
                        Sign out
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Posts Admin Card -->
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 class="text-xl font-semibold mb-4">Blog Posts</h2>
                    <p class="text-gray-600 mb-6">Manage blog posts across the site.</p>
                    <div class="flex gap-4">
                        <a href="/admin/posts/new" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block">
                            Create New Post
                        </a>
                        <a href="/admin/posts" class="text-blue-600 px-4 py-2 hover:underline inline-block">
                            View All Posts
                        </a>
                    </div>
                </div>

                <!-- Events Admin Card -->
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 class="text-xl font-semibold mb-4">Events</h2>
                    <p class="text-gray-600 mb-6">Manage events and exhibitions.</p>
                    <div class="flex gap-4">
                        <a href="/admin/events/new" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block">
                            Create New Event
                        </a>
                        <a href="/admin/events" class="text-blue-600 px-4 py-2 hover:underline inline-block">
                            View All Events
                        </a>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
