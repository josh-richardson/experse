<script>
    import UniverseListing from '../components/universes/UniverseListing.svelte'

    export let params

    let filterFunction = universe => {
        return universe.owner === params.id
    }
</script>

<!--a user profile, either your own or an external one-->
<p class="is-size-3 mb-2">Profile of: {params.id}</p>
<p class="is-size-5 mb-1">Universes created:</p>
<UniverseListing filter={filterFunction} />
<p class="is-size-5 mb-1">Posts created:</p>
