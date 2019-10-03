<script>
	import UniverseListing from '../components/universes/UniverseListing.svelte'
	import { universes } from '../stores/universes'

	let searchTerm = ""
	
	let searchResult = []
	$: searchTerm, searchResult = $universes.filter(universe => {
		return searchTerm != "" && universe.name.toLowerCase().includes(searchTerm.toLowerCase())
	})
</script>

<p>Search</p>

<input class="input is-link" type="text" placeholder="Search daddy" bind:value={searchTerm} />

<UniverseListing customUniverses={searchResult}  />