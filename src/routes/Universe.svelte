<script>
    import { universes } from '../stores/universes'
    import { posts } from '../stores/posts'
    import PostListItem from '../components/posts/PostListItem.svelte'

    export let params = {}

    $: universe = $universes.filter(c => c.id === params.id)[0]
</script>

{#if universe}
    <p class="is-size-3 mb-1">{universe.name}</p>
    <p class="mb-3">{universe.description}</p>
    {#each $posts as post}
        <PostListItem {post} />
    {/each}
{/if}
