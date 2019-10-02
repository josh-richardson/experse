<script>
    import { api } from '../api'
    import { push } from 'svelte-spa-router'
    import { posts } from '../stores/posts'
    import { profile } from '../stores/user'
    import { link } from 'svelte-spa-router'
    import { universes } from '../stores/universes'

    let newPost = { title: '' }

    export let params = {}

    $: universe = $universes.filter(c => c.id === params.id)[0]

    const onCreateClicked = () => {
        if (newPost.title.length > 3 && newPost.body.length > 10) {

          api.createPost({...newPost, creator: $profile.username, universeId: universe.id}, $profile).then(console.log)
            posts.update(u => [...u, newPost])
            push('/universes')
        }
    }
</script>

{#if universe}
<p class="is-size-3 mb-2">Create a Post in /u/{universe.name}</p>

<div class="field mt-2">
    <label class="label">Post Title</label>
    <div class="control">
        <input class="input is-link" type="text" placeholder="Post title" bind:value={newPost.title} />
    </div>
</div>

<div class="field mt-2">
    <label class="label">Post Body</label>
    <textarea
        class="textarea"
        placeholder="The main body of your post"
        bind:value={newPost.body} />
</div>

<div class="field mt-2">
    <label class="label">Post Link (optional)</label>
    <div class="control">
        <input class="input is-link" type="text" placeholder="An associated URL for your post" bind:value={newPost.url} />
    </div>
</div>

<a class="mt-1 button is-pulled-right is-link is-large" on:click={onCreateClicked}>Create Post</a>
{/if}
