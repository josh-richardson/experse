<script>
    import FileDrop from '../components/FileDrop.svelte'
    import { arweave } from '../constants'
    import { profile } from '../stores/user'
    import { api } from '../api'
    import { push } from 'svelte-spa-router'
    import { toastMessage } from '../utils'

    let newUserProfile = { username: '' }
    let validatedFile = undefined

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

    const onSignupClicked = () => {
        if (validatedFile && newUserProfile.username.length > 3) {
            profile.set(newUserProfile)
            api.signupUser(newUserProfile).then(tx => {
                push('/')
            })
        } else {
            toastMessage('Please type a username and select a keyfile!', 'is-danger')
        }
    }
</script>

<!--a page for users to log in-->
<p class="is-size-3 mb-2">Experse Signup</p>

<div class="field mt-2">
    <label class="label">Username</label>
    <div class="control has-icons-left">
        <input class="input is-link" type="text" placeholder="Username" bind:value={newUserProfile.username} />
        <span class="icon is-small is-left">
            <i class="fas fa-user" />
        </span>
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
