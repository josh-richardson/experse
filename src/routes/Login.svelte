<script>
    import FileDrop from '../components/FileDrop.svelte'
    import { push } from 'svelte-spa-router'
    import { arweave } from '../constants'
    import { api } from '../api'
    import { profile } from '../stores/user'
    import { toastMessage } from '../utils'

    let validatedAccount = undefined
    let validatedFile = undefined
    let validatedWallet = undefined

    const droppedFile = e => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onloadend = () => {
            try {
                const wallet = JSON.parse(reader.result)
                arweave.wallets.jwkToAddress(wallet).then(address => {
                    validatedAccount = address
                    validatedWallet = wallet
                    validatedFile = true

                    api.retrieveUserProfile(address, result => {
                        if (result === false) {
                            toastMessage('Please make sure to sign up before trying to log in!', 'is-danger')
                            return
                        }

                        const userDetails = JSON.parse(result.get('data', { decode: true, string: true }))
                        profile.set({ ...userDetails, wallet: wallet })
                        push('/')
                    })
                })
            } catch (e) {
                validatedFile = false
            }
        }

        reader.readAsBinaryString(e.detail)
    }
</script>

<style>
    .drop-wrapper {
        margin-bottom: 10px;
    }

    .error-p {
        text-align: right;
        color: rgba(255, 25, 0, 0.65);
    }
</style>

<p class="is-size-3 mb-1">Experse Login</p>
<p class="mb-1">
    Drop your Arweave keyfile on the area below in order to log in. If you haven't logged in before, you'll need to sign
    up and set a username. It only takes five seconds!
</p>

<div class="drop-wrapper">
    <FileDrop
        on:droppedFile={droppedFile}
        success={validatedFile}
        initialText="Please drop a keyfile here, or click to select!"
        successText="Logging you in now..."
        failureText="That doesn't look like an Arweave keyfile" />
</div>
