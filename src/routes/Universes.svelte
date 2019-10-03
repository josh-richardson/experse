<script>
    import { universes } from '../stores/universes'
    import Universe from '../components/universes/UniverseListItem.svelte'
    import { link } from 'svelte-spa-router'
    import { profile } from '../stores/user'
    import UniverseListing from '../components/universes/UniverseListing.svelte'
</script>

<div class="container level mb-2">
    <div class="level-left">
        <div class="level-item">
            <p class="is-size-3">Universes</p>
        </div>
    </div>
    <div class="level-right">
        <div class="level-item">
            <a use:link href="/universes/create" class="button is-link" disabled={$profile.wallet ? undefined : 'true'}>
                <strong>Create a Universe</strong>
            </a>
        </div>
    </div>
</div>

<div class="container">
    <UniverseListing />
</div>
