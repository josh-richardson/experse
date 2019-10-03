<script>
    import { profile } from '../../stores/user'
    import * as timeago from 'time-ago'
    import { link } from 'svelte-spa-router'
    import { api } from '../../api'
    import { toastMessage } from '../../utils'


    export let comment

    var editObject = {body: comment.body}
    let editing = false

    const onCompleteEditClicked = () => {
        editObject.updatedContent = comment.id;
        api.createUpdate(editObject, $profile).then(result => {
            if (result.id) {
                editObject = {body: comment.body}
                editing = !editing
                toastMessage('Success! Your edit will be visible after being mined.', 'is-success')
            }
        })
    }
</script>

<!--a single item represnting a comment-->
<div class="card mb-1">
    <div class="card-content">
        <div class="media">
            <div class="media-left">
                <div class="columns upvote-container">
                    <div class="column column-upvotes">
                        <a class="button is-small is-white tooltip is-tooltip-left" data-tooltip="Upvote (0.1 AR)">
                                <span class="icon is-small">
                                    <i class="fas fa-angle-up" />
                                </span>
                        </a>
                        <p>0</p>
                        <a class="button is-small is-white tooltip is-tooltip-left" data-tooltip="Downvote (0.1 AR)">
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" />
                                </span>
                        </a>
                    </div>
                    <div class="column">
                        <figure class="image is-48x48">
                            <svg class="user-icon" width="48" height="48" data-jdenticon-value={comment.owner} />
                        </figure>
                    </div>
                </div>
            </div>
            <div class="media-content">
                <p class="item-info">
                    Posted by

                    <span class="darker"> <a href="/profile/{comment.owner}" use:link>{comment.creator}</a></span>
                    ({comment.owner}),
                    <span class="darker">{timeago.ago(comment.date)}</span>
                </p>

                {#if editing}
                    <textarea bind:value={editObject.body} class="textarea is-link" placeholder="Text to edit!" />
                    <a class="mt-1 button is-pulled-right is-link" on:click={onCompleteEditClicked}>Complete edit</a>
                {:else}
                    <div class="post-content">
                        <p>{comment.body}</p>
                    </div>
                {/if}
            </div>
            {#if $profile.wallet && $profile.address === comment.owner}
                <div class="media-right">
                    <a class="button tooltip"
                       data-tooltip="Toggle post editing"
                       on:click={() => {
                editing = !editing
                }}>
                        <span class="icon is-small">
                            <i class="fas fa-edit" />
                        </span>
                    </a>
                </div>
            {/if}
        </div>
    </div>
</div>
