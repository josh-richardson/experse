<script>
    import FileDrop from '../components/FileDrop.svelte'
    import { api } from '../api'
    import { push } from 'svelte-spa-router'
    import { universes } from '../stores/universes'
    import { profile } from '../stores/user'

    let newUniverse = { name: '' }
    let validatedUniversePicture = undefined

    const imageDroppedFile = e => {
        api.readFile(e).then(result => {
            if (result.startsWith('data:image/jpeg;base64') && result.length < 1000000) {
                validatedUniversePicture = true
                newUniverse = { ...newUniverse, icon: result }
            } else {
                validatedUniversePicture = false
            }
        })
    }

    const onCreateClicked = () => {
        if (validatedUniversePicture && newUniverse.name.length > 3 && newUniverse.description.length > 10) {

          api.createUniverse({...newUniverse, creator: $profile.username}, $profile).then(console.log)
            universes.update(u => [...u, newUniverse])
            push('/universes')
        }
    }
</script>

<p class="is-size-3 mb-2">Create a Universe</p>

<div class="field mt-2">
    <label class="label">Universe name</label>
    <div class="control">
        <input class="input is-link" type="text" placeholder="Universe name" bind:value={newUniverse.name} />
    </div>

</div>

<div class="field mt-2">
    <label class="label">Universe Description</label>
    <textarea
        class="textarea"
        placeholder="A few short sentences about what your universe is for"
        bind:value={newUniverse.description} />
</div>

<div class="field mt-2">
    <label class="label">Please select a universe icon (.jpg), under 500kb</label>
    <div class="drop-wrapper">
        <FileDrop
            on:droppedFile={imageDroppedFile}
            success={validatedUniversePicture}
            initialText="Please an image here, or click to select!"
            successText="Got it!"
            failureText="That doesn't look like a JPEG image" />
    </div>
</div>

<a class="mt-1 button is-pulled-right is-link is-large" on:click={onCreateClicked}>Sign Up</a>
