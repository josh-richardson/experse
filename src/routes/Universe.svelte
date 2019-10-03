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
    export let params = {}

    posts.set([])

    let universe = undefined
    import * as _ from 'lodash'

    $: {
        universe = $universes.filter(c => c.id === params.id)[0]

        if (universe) {
            posts.set(devPosts)
            api.postsByUniverse(universe.id, results => {
                results.forEach(async p => {
                    const postDetails = JSON.parse(p.get('data', { decode: true, string: true }))
                    const owner = await arweave.wallets.ownerToAddress(p.owner)
                    posts.update(current =>
                        _.orderBy([...current, { ...postDetails, id: p.id, owner: owner }], ['date'])
                    )
                })
            })
        }
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

    {#each $posts as post}
        <PostListItem {post} />
    {/each}
{/if}
