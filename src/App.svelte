<script>

	import Home from './routes/Universe.svelte'
	import Router from 'svelte-spa-router'

	const routes = {
		'/': Home
	}
</script>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>

<svelte:head>
	<title>Experse - Decentralized Discussion</title>
</svelte:head>

<div class="container">
	<Router {routes}/>
</div>

