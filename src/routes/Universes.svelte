<script>
    import { universes } from '../stores/universes'
    import Universe from '../components/universes/UniverseListItem.svelte'
    import { link } from 'svelte-spa-router'
</script>

<div class="container level mb-2">
    <div class="level-left">
        <div class="level-item">
            <p class="is-size-3">Universes</p>
        </div>
    </div>
    <div class="level-right">
        <div class="level-item">
            <a use:link href="/universes/create" class="button is-link">
                <strong>Create a Universe</strong>
            </a>
        </div>
    </div>
</div>

<div class="container">
    {#each $universes as universe}
        <Universe {universe} />
    {/each}
</div>
