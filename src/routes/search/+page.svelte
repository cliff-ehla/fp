<script>
    export let data
    const {posts, events, search_key} = data
    import PostPreview from "../../lib/PostPreview.svelte";
    import EventPreview from "../../lib/EventPreview.svelte";
    console.log(data)
</script>

<h1>Search: {search_key}</h1>
<h2 class="text-amber-700">Posts</h2>
{#if posts.length}
    {#each posts as post}
        <div class="m-4">
            <a href="/art-notes/{post.attributes.slug}">
                <p>{post.attributes.title}</p>
            </a>
        </div>
<!--        <PostPreview {post}/>-->
    {/each}
{:else}
    No record
{/if}

<h2 class="text-amber-700">Events</h2>
{#if events.length}
    {#each events as event}
        <div class="m-4">
            <p>{event.attributes.title}</p>
        </div>
<!--        <EventPreview {event}/>-->
    {/each}
{:else}
    No record
{/if}

<svelte:head>
    <title>Search {search_key} - Floating Projects Collective</title>
</svelte:head>