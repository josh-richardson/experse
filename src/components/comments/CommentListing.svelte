<script>
    import { api } from '../../api'
    import { arweave } from '../../constants'
    import CommentListItem from './CommentListItem.svelte'
    import * as _ from 'lodash'
    var comments = []
    export let postId
    $: {
        if (postId && comments.length === 0) {
            api.commentsByPost(postId, results => {
                results.forEach(async c => {
                    const commentDetails = JSON.parse(c.get('data', { decode: true, string: true }))
                    const owner = await arweave.wallets.ownerToAddress(c.owner)
                    comments = [...comments, { ...commentDetails, owner }]
                    comments = _.orderBy(comments, ['date'])
                })
            })
        }
    }
</script>

<!--a listing of comments on a post-->
{#each comments as comment}
    <CommentListItem {comment} />
{/each}
