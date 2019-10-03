import App from './App.svelte'
import 'jdenticon'
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css';

const app = new App({
    target: document.body,
})

window.jdenticon_config = {
    replaceMode: 'observe',
}

window.app = app

export default app
