<script>
    import { posts } from '../../stores/posts'
    import { universes } from '../../stores/universes'
    import { arweave } from '../../constants'
    posts.set([])

    export let universeId
    export let userId
    let universe = undefined
    import * as _ from 'lodash'
    import PostListItem from './PostListItem.svelte'
    import { api } from '../../api'
    $: {
      if (universeId) {
          api.postsByUniverse(universeId, results => {
              results.forEach(async p => {
                  const postDetails = JSON.parse(p.get('data', { decode: true, string: true }))
                  const owner = await arweave.wallets.ownerToAddress(p.owner)
                  posts.update(current =>
                          _.orderBy([...current, { ...postDetails, id: p.id, owner: owner }], ['date'])
                  )
              })
          })
      } else if (userId) {
          api.postsByUser(userId, results => {
              results.forEach(async p => {
                  const postDetails = JSON.parse(p.get('data', { decode: true, string: true }))
                  const owner = await arweave.wallets.ownerToAddress(p.owner)
                  posts.update(current =>
                          _.orderBy([...current, { ...postDetails, id: p.id, owner: owner }], ['date'])
                  )
              })
          })
      }

    }
</script>

<!--a listing of comments on a post-->
{#each $posts as post}
    <PostListItem {post} />
{/each}
