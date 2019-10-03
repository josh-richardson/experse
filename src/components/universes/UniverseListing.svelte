<script>
    import { link } from 'svelte-spa-router'
    import Universe from '../universes/UniverseListItem.svelte'
    import { universes } from '../../stores/universes'

    export let filter
    export let customUniverses
</script>

{#if customUniverses !== undefined}
    {#each customUniverses as universe}
        <Universe {universe} />
    {/each}
{:else}
    {#each $universes as universe}
        {#if filter && filter(universe) === true}
            <Universe {universe} />
        {:else if !filter}
            <Universe {universe} />
        {/if}
    {/each}
{/if}
