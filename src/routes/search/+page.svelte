<script>
    export let data
    let {events, search_key} = data
    $: posts = data.posts
    import PostPreview from "../../lib/PostPreview.svelte";
    import EventPreview from "../../lib/EventPreview.svelte";
    import { goto } from '$app/navigation';
    const onSubmit = (e) => {
        e.preventDefault()
        goto(`/search?q=${search_key}`)
    }
</script>

<div class="container mt-12 mb-8">
    <h1 class="text-5xl my-12 text-gray-500 text-center font-light">Search</h1>
    <div class="flex justify-center my-12">
        <form on:submit={onSubmit} class="inline-flex border-2 border-gray-400">
            <input class="text-xl px-4 py-2" type="text" bind:value={search_key}/>
            <button class="px-4 bg-gray-700 text-white" type="submit">Search</button>
        </form>
    </div>
    <h2 class="text-3xl my-12 text-gray-500 text-center font-light">Posts</h2>
    {#if posts.length}
        {#each posts as post}
    <!--        <div class="m-4">-->
    <!--            <a href="/art-notes/{post.attributes.slug}">-->
    <!--                <p>{post.attributes.title}</p>-->
    <!--            </a>-->
    <!--        </div>-->
            <PostPreview {post}/>
        {/each}
    {:else}
        No record
    {/if}

    <h2 class="text-3xl my-12 text-gray-500 text-center font-light">Events</h2>
    {#if events.length}
        {#each events as event}
            <div class="m-4">
                <p>{event.attributes.title}</p>
            </div>
            <EventPreview {event}/>
        {/each}
    {:else}
        No record
    {/if}
</div>

<svelte:head>
    <title>Search {search_key} - Floating Projects Collective</title>
</svelte:head>