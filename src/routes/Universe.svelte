<script>
    import { universes } from '../stores/universes'
    import { posts } from '../stores/posts'
    import PostListItem from '../components/posts/PostListItem.svelte'
    import { link } from 'svelte-spa-router'
    import { onMount } from 'svelte'
    import { api } from '../api'

    export let params = {}

    posts.set([])

    let universe = undefined

    $: {
        universe = $universes.filter(c => c.id === params.id)[0]
        if (universe) {
            api.postsByUniverse(universe.id, (results) => {

                results.forEach(p => {
                    const postDetails = JSON.parse(p.get('data', { decode: true, string: true }))
                    console.log(postDetails)
                  posts.update(current => [...current, {...postDetails, id: p.id}])
                })
            });
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
                <a use:link href="/posts/create/{universe.id}" class="button is-link">
                    <strong>Create a Post</strong>
                </a>
            </div>
        </div>
    </div>

    <p class="mb-2">{universe.description}</p>



    {#each $posts as post}
        <PostListItem {post} />
    {/each}
{/if}
