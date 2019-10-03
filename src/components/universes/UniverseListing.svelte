<script>
    import { link } from 'svelte-spa-router'
    import Universe from '../universes/UniverseListItem.svelte'
    import { universes } from '../../stores/universes'

    export let filter
</script>

{#each $universes as universe}
    {#if filter && filter(universe)}
        <Universe {universe} />
    {:else}
        <Universe {universe} />
    {/if}
{/each}
