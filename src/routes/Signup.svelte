<script>
    import FileDrop from '../components/FileDrop.svelte'
    import { arweave } from '../constants'
    import { profile } from '../stores/user'
    import { api } from '../api'
    import { push } from 'svelte-spa-router'

    let newUserProfile = { username: '' }
    let validatedFile = undefined
    let validatedProfilePicture = undefined

    const walletDroppedFile = e => {
        api.readFile(e).then(result => {
            try {
                const wallet = JSON.parse(result)
                arweave.wallets.jwkToAddress(wallet).then(address => {
                    newUserProfile = { ...newUserProfile, address: address, wallet: wallet }
                    validatedFile = true
                })
            } catch (e) {
                validatedFile = false
            }
        })
    }

    const imageDroppedFile = e => {
        api.readFile(e).then(result => {
            if (result.startsWith('data:image/jpeg;base64') && result.length < 1000000) {
                validatedProfilePicture = true
                newUserProfile = { ...newUserProfile, profilePicture: result }
            } else {
                validatedProfilePicture = false
            }
        })
    }

    const onSignupClicked = () => {
        if (validatedProfilePicture && validatedFile && newUserProfile.username.length > 3) {
            profile.set(newUserProfile)
            api.signupUser(newUserProfile).then(tx => {
                push('/')
            })
        } else {
        }
    }
</script>

<!--a page for users to log in-->
<p class="is-size-3 mb-2">Experse Signup</p>

<div class="field mt-2">
    <label class="label">Username</label>
    <div class="control has-icons-left has-icons-right">
        <input class="input is-link" type="text" placeholder="Username" bind:value={newUserProfile.username} />
        <span class="icon is-small is-left">
            <i class="fas fa-user" />
        </span>
        <span class="icon is-small is-right">
            <i class="fas fa-check" />
        </span>
    </div>
    <p class="help is-link">This username is available</p>
</div>

<div class="field mt-2">
    <label class="label">Please select a profile photo (.jpg), under 500kb</label>
    <div class="drop-wrapper">
        <FileDrop
            on:droppedFile={imageDroppedFile}
            success={validatedProfilePicture}
            initialText="Please an image here, or click to select!"
            successText="Got it!"
            failureText="That doesn't look like a JPEG image" />
    </div>
</div>

<div class="field mt-2">
    <label class="label">Please select an Arweave keyfile</label>

    <div class="drop-wrapper">
        <FileDrop
            on:droppedFile={walletDroppedFile}
            success={validatedFile}
            initialText="Please drop a keyfile here, or click to select!"
            successText="All set!"
            failureText="That doesn't look like an Arweave keyfile" />
    </div>
</div>

<a class="mt-1 button is-pulled-right is-link is-large" on:click={onSignupClicked}>Sign Up</a>
