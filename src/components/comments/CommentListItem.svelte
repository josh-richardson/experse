<script>
    import { profile } from '../../stores/user'
    import * as timeago from 'time-ago'
    import { link } from 'svelte-spa-router'

    export let comment
</script>

<!--a single item represnting a comment-->
<div class="card mb-1">
    <div class="card-content">
        <div class="media">
            <div class="media-left">
                <figure class="image is-48x48">
                    <svg class="user-icon" width="48" height="48" data-jdenticon-value={comment.owner} />
                </figure>
            </div>

            <div class="media-content">
                <p class="item-info">
                    Posted by

                    <span class="darker"> <a href="/profile/{comment.owner}" use:link>{comment.creator}</a></span>
                    ({comment.owner}),
                    <span class="darker">{timeago.ago(comment.date)}</span>
                </p>
                <div class="post-content">
                    <p>{comment.body}</p>
                </div>
            </div>
            {#if $profile.wallet && $profile.address === comment.owner}
                <div class="media-right">
                    <a class="button">
                        <span class="icon is-small">
                            <i class="fas fa-edit" />
                        </span>
                    </a>
                </div>
            {/if}
        </div>
    </div>
</div>
