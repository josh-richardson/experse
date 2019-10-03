<script>
    import { universes } from '../stores/universes'
    import { posts } from '../stores/posts'
    import PostListItem from '../components/posts/PostListItem.svelte'
    import { link } from 'svelte-spa-router'
    import { onMount } from 'svelte'
    import { api } from '../api'
    import { devPosts } from '../dev_variables'
    import { arweave } from '../constants'
    import { profile } from '../stores/user'

    import PostListing from '../components/posts/PostListing.svelte'

    export let params = {}

    posts.set([])

    let universe = undefined

    console.log("mounted")

    $: {
        universe = $universes.filter(c => c.id === params.id)[0]
    }
</script>

{#if universe}

    <div class="container level mb-1">
        <div class="level-left">
            <div class="level-item">
                <p class="is-size-3">{universe.name}</p>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item">
                <a
                    use:link
                    href="/posts/create/{universe.id}"
                    class="button is-link"
                    disabled={$profile.wallet ? undefined : 'true'}>
                    <strong>Create a Post</strong>
                </a>
            </div>
        </div>
    </div>

    <p class="mb-2">About this Universe: {universe.description}</p>

    <PostListing universeId={universe.id} />
<!--    {#each $posts as post}-->
<!--        <PostListItem {post} />-->
<!--    {/each}-->
{/if}
