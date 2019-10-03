<script>
    import UniverseListing from '../components/universes/UniverseListing.svelte'
    import PostListItem from '../components/posts/PostListItem.svelte'
    import { universes } from '../stores/universes'
    import { posts } from '../stores/posts'
    import { api } from '../api'

    let searchTerm = ''

    let universeSearchResult = []
    let postSearchResult = []
    $: searchTerm,
        (universeSearchResult = $universes.filter(universe => {
            return searchTerm != '' && universe.name.toLowerCase().includes(searchTerm.toLowerCase())
        }))

    let allPosts = []
    api.allPosts(posts => (allPosts = posts.map(post => JSON.parse(post.get('data', { decode: true, string: true })))))

    $: searchTerm,
        (postSearchResult = allPosts.filter(post => {
            return (
                searchTerm != '' &&
                (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.body.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }))
</script>

<h1>Search</h1>

<input class="input is-link" type="text" placeholder="Search here..." bind:value={searchTerm} />

<h2>Universe Results</h2>

<UniverseListing customUniverses={universeSearchResult} />

<h2>Post Results</h2>

{#each postSearchResult as post}
    <PostListItem {post} />
{/each}
