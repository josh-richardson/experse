<script>
    import { posts } from '../stores/posts'
    import { api } from '../api'
    import { arweave } from '../constants'
    import showdown from 'showdown'
    import * as timeago from 'time-ago'
    import { profile } from '../stores/user'
    import CommentListing from '../components/comments/CommentListing.svelte'
    import { toastMessage } from '../utils'
    import { link } from 'svelte-spa-router'
    import * as _ from 'lodash'

    export let params = {}
    var editObject = {body: ''}

    let updates = [];
    var post, postHtml

    const checkForPostUpdates = (id) => {
        api.updatesById(id, (results) => {
          results.forEach(r => {
              const updateDetails = JSON.parse(r.get('data', { decode: true, string: true }))
              updates = _.orderBy([...updates, updateDetails], ['date']);
              post.oldBody = post.body;
              post.body = updates[0].body;
              postHtml = converter.makeHtml(post.body)
          })
        })
    }


    var converter = new showdown.Converter()

    $: {
        if (!post) {
            post = $posts.filter(c => c.id === params.id)[0]
            if (post) {
                postHtml = converter.makeHtml(post.body)
                editObject.body = post.body
                checkForPostUpdates(post.id);
            }
        }
    }
    if ($posts.length === 0) {
        arweave.transactions.get(params.id).then(async result => {
            const postDetails = JSON.parse(result.get('data', { decode: true, string: true }))
            const owner = await arweave.wallets.ownerToAddress(result.owner)
            posts.update(p => [...p, { id: result.id, ...postDetails, owner: owner }])
        })
    }

    let buttonDisabled = false

    var newReply = {}

    const onCreateReplyClicked = () => {
        buttonDisabled = true
        api.createComment({ ...newReply, creator: $profile.username, postId: post.id }, $profile)
            .then(result => {
                if (result.id) {
                    buttonDisabled = false
                    newReply.body = ''
                    toastMessage('Success! Your comment will be visible after being mined.', 'is-success')
                }
            })
            .catch(() => {
                toastMessage('Failure! An error occured.', 'is-danger')
                return (buttonDisabled = false)
            })
    }

    let editing = false
    let historyMode = false

    const onCompleteEditClicked = () => {
      editObject.updatedContent = post.id;
      api.createUpdate(editObject, $profile).then(result => {
        if (result.id) {
          editObject = {body: ''}
          editing = !editing
          toastMessage('Success! Your edit will be visible after being mined.', 'is-success')
        }
      })
    }

    const onScoreUpClicked = () => {
        api.createScore({type: 'up', postID: post.id}, $profile).then(result => {
            if (result.id) {
                toastMessage('Success! Your scoring will be visible after being mined.', 'is-success')
            }
        })
    }

    const onScoreDownClicked = () => {
        api.createScore({type: 'down', postID: post.id}, $profile).then(result => {
            if (result.id) {
                toastMessage('Success! Your scoring will be visible after being mined.', 'is-success')
            }
        })
    }
</script>

<style>
    :global(.post-content h1) {
        font-size: 2em !important;
        color: red;
    }

    :global(.post-content ul) {
        list-style: circle;
        padding-left: 1.6em;
    }

    :global(.post-content img) {
        max-width: 60% !important;
        max-height: 60% !important;
        display: block;
        margin: auto;
    }

    hr.in-post {
        margin-top: 0.4em;
    }

    :global(.upvote-container) {
        max-width: 100px;
        padding-right: 0.8em;
    }

    :global(.upvote-container .column) {
        padding: 0 !important;
    }

    :global(.upvote-container p) {
        margin: 0 0 0 10px;
        padding: 0;
        font-size: 0.75em;
    }


    :global(.column-upvotes) {
        transform: translateY(-12px);
    }
</style>

<!--details of a post and associated replies-->
{#if post}
    <div class="card mb-1">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <div class="columns upvote-container">
                        <div class="column column-upvotes">
                            <a class="button is-small is-white tooltip is-tooltip-left" data-tooltip="Upvote (0.1 AR)" on:click={onScoreUpClicked}>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-up" />
                                </span>
                            </a>
                            <p>0</p>
                            <a class="button is-small is-white tooltip is-tooltip-left" data-tooltip="Downvote (0.1 AR)" on:click={onScoreDownClicked}>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" />
                                </span>
                            </a>
                        </div>
                        <div class="column">
                            <figure class="image is-48x48">
                                <svg class="user-icon" width="48" height="48" data-jdenticon-value={post.owner} />
                            </figure>
                        </div>
                    </div>
                </div>
                <div class="media-content">

                    <p class="item-info">
                        Created by
                        <span class="darker">
                            <a href="/profile/{post.owner}" use:link>{post.creator}</a>
                        </span>
                        ({post.owner}),
                        <span class="darker">{timeago.ago(post.date)}</span>
                    </p>
                    <p class="is-size-4 post-title">{post.title}</p>
                    <hr class="in-post" />

                    {#if editing}
                        <textarea bind:value={editObject.body} class="textarea is-link" placeholder="Text to edit!" />
                        <a class="mt-1 button is-pulled-right is-link" on:click={onCompleteEditClicked}>Complete edit</a>
                    {:else}
                        <div class="post-content">
                            <p class="mb-1">
                                {@html postHtml}
                            </p>
                        </div>
                    {/if}

                </div>

                    <div class="media-right">
                {#if $profile.wallet && $profile.address === post.owner}
                        <a
                            class="button tooltip"
                            data-tooltip="Toggle post editing"
                            on:click={() => {
                                editing = !editing
                            }}>
                            <span class="icon is-small">
                                <i class="fas fa-edit" />
                            </span>
                        </a>
                {/if}
                        {#if updates.length !== 0}
                                <a
                                    class="button tooltip"
                                    data-tooltip="View update history"
                                    on:click={() => {
                        historyMode = !historyMode
                                        }}>
                            <span class="icon is-small">
                                <i class="fas fa-history" />
                            </span>
                            </a>
                        {/if}
                    </div>

            </div>
        </div>
    </div>

    <div class="column is-11 is-pulled-right">
        <CommentListing postId={params.id} />

        <hr />
        <p class="is-size-4 mb-1">Post a reply:</p>
        <textarea
            bind:value={newReply.body}
            class="textarea is-link"
            placeholder={$profile.wallet ? 'Your reply. Remember to be nice!' : 'You need to log in first!'}
            disabled={!$profile.wallet} />
        <a
            class="mt-1 button is-pulled-right is-link"
            on:click={onCreateReplyClicked}
            disabled={$profile.wallet || buttonDisabled ? undefined : 'true'}>
            Reply
        </a>
    </div>
{/if}
