<script>
    import Universe from './routes/Universe.svelte'
    import Universes from './routes/Universes.svelte'
    import Login from './routes/Login.svelte'
    import Signup from './routes/Signup.svelte'
    import Home from './routes/Home.svelte'
    import About from './routes/About.svelte'
    import CreateUniverse from './routes/CreateUniverse.svelte'
    import Post from './routes/Post.svelte'
    import Profile from './routes/Profile.svelte'

    import Router from 'svelte-spa-router'
    import 'bulma/css/bulma.css'
    import './resources/fontawesome/all.css'
    import { onMount } from 'svelte'
    let isBurgerVisible = false
    import { profile } from './stores/user'
    import { link } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'
    import { LOGO } from './images'
    import { universes } from './stores/universes'
    import * as dev_variables from './dev_variables'
    import { posts } from './stores/posts'
    import { api } from './api'

    const routes = {
        '/': Home,
        '/login': Login,
        '/signup': Signup,
        '/about': About,
        '/universes/create/': CreateUniverse,
        '/u/:id': Universe,
        '/universes/': Universes,
        '/p/:id': Post,
        '/profile': Profile,
    }

    function toggleBurger() {
        isBurgerVisible = !isBurgerVisible
    }

    onMount(async () => {
        universes.set(dev_variables.universes)
        posts.set(dev_variables.posts)

        api.allUniverses((result) => {
          result.forEach(universeTx => {
              const universeBody = JSON.parse(universeTx.get('data', { decode: true, string: true }))

              return universes.update(u => [...u, universeBody])
          })
        });
    })
</script>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    :global(.mt-1) {
        margin-top: 1rem !important;
    }
    :global(.mt-2) {
        margin-top: 2rem !important;
    }
    :global(.mt-3) {
        margin-top: 3rem !important;
    }
    :global(.mt-4) {
        margin-top: 4rem !important;
    }
    :global(.mt-5) {
        margin-top: 5rem !important;
    }

    :global(.mb-1) {
        margin-bottom: 1rem !important;
    }
    :global(.mb-2) {
        margin-bottom: 2rem !important;
    }
    :global(.mb-3) {
        margin-bottom: 3rem !important;
    }
    :global(.mb-4) {
        margin-bottom: 4rem !important;
    }
    :global(.mb-5) {
        margin-bottom: 5rem !important;
    }

    .navbar-item {
        color: #4a4a4a;
    }

    .logo-text {
        color: black;
        font-size: 1.2em;
        margin-left: 8px;
    }

    .logo:hover {
        text-decoration: none;
    }
</style>

<svelte:head>
    <title>Experse - Decentralized Discussion</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<nav class="navbar has-shadow is-spaced" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item logo" use:link href="/">
            <img src="data:image/png;base64,{LOGO}" alt="logo" />
            <span class="logo-text">Experse</span>
        </a>

        <a
            role="button"
            class="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            on:click={toggleBurger}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
        </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu {isBurgerVisible ? 'is-active' : ''}">
        <div class="navbar-start">
            <a href="/" use:link class="navbar-item">Home</a>
            <a href="/universes" use:link class="navbar-item">Universes</a>
            <a href="/about" use:link class="navbar-item">About</a>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    {#if $profile.wallet}
                        <a use:link class="button is-light" href="/profile">My Profile</a>
                    {:else}
                        <a use:link href="/signup" class="button is-link">
                            <strong>Sign up</strong>
                        </a>
                        <a use:link class="button is-light" href="/login">Log in</a>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</nav>

<div class="section">
    <div class="container">
        <div class="columns is-centered">
            <div class="column is-10">
                <Router {routes} />
            </div>
        </div>
    </div>
</div>
