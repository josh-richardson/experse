<script>
    import { link } from 'svelte-spa-router'

    export let post
</script>

<div class="card mb-1">

    <div class="card-content">
        <a href="/p/{post.id}" use:link>
            <p class="title is-4">{post.title}</p>
            <p class="subtitle is-6">Created by {post.creator}</p>
        </a>

        <div class="content">{post.body}</div>
    </div>

</div>
