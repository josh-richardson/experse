<script>
    import { link } from 'svelte-spa-router'
    import * as timeago from 'time-ago'
    export let post
</script>

<style>
    :global(.item-info) {
        color: darkgray;
        font-size: 0.8em;
        margin-bottom: 0.4em !important;
    }

    :global(.darker) {
        color: #6e6e6e;
    }

    :global(.user-icon) {
        border-radius: 50%;
        border: 1.5px solid darkgray;
    }
</style>

<div class="card mb-1">

    <div class="card-content">
        <div class="media">
        <div class="media-left">
            <figure class="image is-48x48">
                <svg class="user-icon" width="48" height="48" data-jdenticon-value={post.owner} />
            </figure>
        </div>

        <div class="media-content">
            <p class="item-info">Created by <span class="darker">{post.creator}</span> ({post.owner}), <span class="darker">{timeago.ago(post.date)}</span></p>
            <a href="/p/{post.id}" use:link>
                <p class="title is-4">{post.title}</p>
            </a>
        </div>
        </div>
    </div>

</div>

<div class="post-content"/>
