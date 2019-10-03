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


    export let params = {}
    var editObject = {}

    var converter = new showdown.Converter()
    var post, postHtml
    $: {
        post = $posts.filter(c => c.id === params.id)[0]
        if (post) {
            postHtml = converter.makeHtml(post.body)
            editObject.body = post.body;
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
</style>

<!--details of a post and associated replies-->
{#if post}
    <div class="card mb-1">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <svg class="user-icon" width="48" height="48" data-jdenticon-value={post.owner} />
                    </figure>
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
                        <a class="mt-1 button is-pulled-right is-link tooltip" on:click={onCreateReplyClicked} data-tooltip="Tooltip Text">Complete edit</a>
                    {:else}
                        <div class="post-content">
                            <p class="mb-1">
                                {@html postHtml}
                            </p>
                        </div>
                    {/if}

                </div>
                {#if true}
                    <div class="media-right">
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
                    </div>
                {/if}
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
