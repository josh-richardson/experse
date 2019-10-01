<script>
    import { posts } from '../stores/posts'

    export let params = {}

    $: post = $posts.filter(c => c.id === params.id)[0]
</script>

<!--details of a post and associated replies-->
{#if post}
    <p class="is-size-3 mb-1">{post.title}</p>
    <p class="mb-3">{post.content}</p>
{/if}
