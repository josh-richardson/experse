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
    import { comments } from '../stores/comments'
    import { universes } from '../stores/universes'

    export let params = {}
    var editObject = { body: '' }

    let updates = []
    let score = 0
    var post, postHtml
    var currentUniverse

    let userVoted = false

    const asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    const checkForPostUpdates = (id, owner) => {
        api.updatesById(id, owner, results => {
            results.forEach(r => {
                const updateDetails = JSON.parse(r.get('data', { decode: true, string: true }))
                updates = _.orderBy([...updates, updateDetails], ['date'])
                if (!post.oldBody) post.oldBody = post.body
                post.body = updates[updates.length - 1].body
                editObject = { body: post.body }
                postHtml = converter.makeHtml(post.body)
            })
        })

        let scores = []

        api.scoresByPost(post.id, async result => {
            let ownersAccountedFor = []
            await asyncForEach(result, async r => {
                const owner = await arweave.wallets.ownerToAddress(r.owner)
                const scoreDetails = JSON.parse(r.get('data', { decode: true, string: true }))
                scores = _.orderBy([...scores, { ...scoreDetails, owner }], ['date'])
            })

            for(let scoreObj of scores) {
                if(ownersAccountedFor.includes(scoreObj.owner)) {
                    continue
                }
                ownersAccountedFor.push(scoreObj.owner)

                score += scoreObj.type == 'up' ? 1 : -1

                if(scoreObj.owner == $profile.address) {
                    userVoted = true
                }
            }
        })
    }

    var converter = new showdown.Converter()

    $: {
        if (!post) {
            comments.set([])
            post = $posts.filter(c => c.id === params.id)[0]
            if (post) {
                postHtml = converter.makeHtml(post.body)
                editObject.body = post.body
                checkForPostUpdates(post.id, post.owner)
            }
        }
    }

    $: {
      if (post) {
          var potentialUniverses = $universes.filter(x => x.id === post.universeId);
          if (potentialUniverses.length > 0) {
              currentUniverse = potentialUniverses[0];
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
        editObject.updatedContent = post.id
        api.createUpdate(editObject, $profile).then(result => {
            if (result.id) {
                editObject = { body: '' }
                editing = !editing
                toastMessage('Success! Your edit will be visible after being mined.', 'is-success')
            }
        })
    }


    const onScoreUpClicked = () => {
        if(!$profile.wallet) {
            toastMessage('Please log in!', 'is-danger')
            return
        }

        if(userVoted) {
            toastMessage('You have already scored this post!', 'is-danger')
            return
        }

        api.createScore({ type: 'up', postId: post.id }, $profile).then(result => {
            if (result.id) {
                toastMessage('Success! Your scoring will be visible after being mined.', 'is-success')
            }
        })
    }

    const onScoreDownClicked = () => {
        if(!$profile.wallet) {
            toastMessage('Please log in!', 'is-danger')
            return
        }

        if(userVoted) {
            toastMessage('You have already scored this post!', 'is-danger')
            return
        }

        api.createScore({ type: 'down', postId: post.id }, $profile).then(result => {
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
                            <a
                                class="button is-small is-white tooltip is-tooltip-left"
                                data-tooltip="Upvote (0.1 AR)"
                                on:click={onScoreUpClicked}>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-up" />
                                </span>
                            </a>
                            <p>{score}</p>
                            <a
                                class="button is-small is-white tooltip is-tooltip-left"
                                data-tooltip="Downvote (0.1 AR)"
                                on:click={onScoreDownClicked}>
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
                        <span class="darker">{timeago.ago(post.date)} {updates.length !== 0 ? ', updated ' + timeago.ago(updates[updates.length - 1].date) : ''}
                        {#if currentUniverse}
                            in <a href="/u/{currentUniverse.id}" use:link>/u/{currentUniverse.name}</a>
                        {/if}
                        </span>
                    </p>
                    <p class="is-size-4 post-title">{post.title}</p>
                    <hr class="in-post" />

                    {#if editing}
                        <textarea bind:value={editObject.body} class="textarea is-link" placeholder="Text to edit!" />
                        <a class="mt-1 button is-pulled-right is-link" on:click={onCompleteEditClicked}>
                            Complete edit
                        </a>
                    {:else if historyMode}
                        {#each updates as update}
                            <div class="card">
                                <p class="item-info">Update ({timeago.ago(update.date)}):</p>
                                {@html converter.makeHtml(update.body)}

                            </div>
                        {/each}
                        <div class="card">
                            <p class="item-info">Original content ({timeago.ago(post.date)}):</p>
                            <p class="mb-1">
                                {@html converter.makeHtml(post.oldBody)}
                            </p>
                        </div>
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
