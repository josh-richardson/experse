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
                </a>
                <p class="subtitle is-6">
                    Created by
                    <a href="/profile/{universe.owner}" use:link>{universe.creator}</a>
                    <span class="address-item">({universe.owner})</span>
                </p>

            </div>
        </div>

        <div class="content">{universe.description}</div>
    </div>

</div>
