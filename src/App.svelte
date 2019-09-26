<script>

  import Universe from './routes/Universe.svelte'
  import Login from './routes/Login.svelte'
  import Signup from './routes/Signup.svelte'
  import Home from './routes/Signup.svelte'
  import About from './routes/About.svelte'
  import CreateUniverse from './routes/CreateUniverse.svelte'
  import Post from './routes/Post.svelte'
  import Profile from './routes/Profile.svelte'

  import Router from 'svelte-spa-router'
  import 'bulma/css/bulma.css'
  let isBurgerVisible = false

  import {link} from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
  import { LOGO } from './images'

  const routes = {
    '/': Home,
    '/login': Login,
    '/signup': Signup,
    '/about': About,
    '/universe/create/': CreateUniverse,
    '/universe/:id': Universe,
    '/post/:id': Post,
    '/profile': Profile,



  }

  function toggleBurger() {
    isBurgerVisible = !isBurgerVisible
  }
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  /*:global(a.active) {*/
  /*  background-color: rgba(250, 250, 250, 0.5);*/
  /*}*/

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
      <a href="/" use:link use:active class="navbar-item">Home</a>
      <a href="/universes" use:link use:active class="navbar-item">Universes</a>
      <a href="/about" use:link use:active class="navbar-item">About</a>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a use:link href="/signup" class="button is-link">
            <strong>Sign up</strong>
          </a>
          <a use:link class="button is-light" href="/login">Log in</a>
        </div>
      </div>
    </div>
  </div>
</nav>

<div class="container">
  <Router {routes} />
</div>
