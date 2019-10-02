<!--a listing of comments on a post-->

<script>
    import { api } from '../../api'
    import { arweave } from '../../constants'
    import { profile } from '../../stores/user'
    import * as timeago from 'time-ago'
    var comments = [];
    export let postId;
    $: {
        if (postId && comments.length === 0) {
            api.commentsByPost(postId, (results) => {
                results.forEach(async c => {
                    const commentDetails = JSON.parse(c.get('data', { decode: true, string: true }))
                    const owner = await arweave.wallets.ownerToAddress(c.owner);
                    comments = [...comments, {...commentDetails, owner}]
                })
            })
        }
    }
</script>

{#each comments as comment}
    <div class="card mb-1">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <svg class="user-icon" width="48" height="48" data-jdenticon-value={comment.owner} />
                    </figure>
                </div>

                <div class="media-content">
                    <p class="item-info">Posted by <span class="darker">{comment.creator}</span> ({comment.owner}), <span class="darker">{timeago.ago(comment.date)}</span></p>
                    <div class="post-content">
                        <p>
                            {comment.body}
                        </p>
                    </div>
                </div>
                {#if $profile.wallet && $profile.address === comment.owner}
                    <div class="media-right">
                        <a class="button">
                        <span class="icon is-small">
                          <i class="fas fa-edit"></i>
                        </span>
                        </a>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/each}
