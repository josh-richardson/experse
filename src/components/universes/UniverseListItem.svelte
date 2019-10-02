<script>
    import { link } from 'svelte-spa-router'

    export let universe
</script>

<style>
    a {
    }

    :global(.address-item) {
        font-size: 0.9em;
        color: darkgray;
    }
</style>

<div class="card mb-1">

    <div class="card-content">
        <div class="media">
            <div class="media-left">
                <figure class="image is-48x48">
                    <img src={universe.icon} alt="universe icon" />
                </figure>
            </div>
            <div class="media-content">
                <a href="/u/{universe.id}" use:link>
                    <p class="title is-4">{universe.name}</p>
                    <p class="subtitle is-6">Created by {universe.creator} <span class="address-item">({universe.owner})</span></p>
                </a>
            </div>
        </div>


        <div class="content">{universe.description}</div>
    </div>

</div>
