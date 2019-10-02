<script>
    import { posts } from '../stores/posts'
    import { api } from '../api'
    import { arweave } from '../constants'

    export let params = {}

    $: post = $posts.filter(c => c.id === params.id)[0]
    if ($posts.length === 0) {
        console.log(params.id)
        arweave.transactions.get(params.id).then((result) => {
            const postDetails = JSON.parse(result.get('data', { decode: true, string: true }))
            posts.update(p => [...p, {id: result.id, ...postDetails}])
        })
    }
</script>

<!--details of a post and associated replies-->
{#if post}
    <p class="is-size-3 mb-1">{post.title}</p>
    <p class="mb-3">{post.body}</p>
{/if}
