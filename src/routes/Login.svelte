<!--a page for users to log in-->
<script>
    import FileDrop from '../components/FileDrop.svelte'
    import { push } from 'svelte-spa-router'
    import { arweave } from '../constants'



    let validatedAccount = undefined
    let validatedFile = undefined
    let validatedWallet = undefined

    const droppedFile = e => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onloadend = () => {
            try {
                const wallet = JSON.parse(reader.result)
                arweave.wallets.jwkToAddress(wallet).then((address) => {
                    validatedAccount = address
                    validatedWallet = wallet
                    validatedFile = true
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


<h1>Experse Login</h1>
<p>You'll need to drop an Arweave keyfile, and allow access to your MetaMask wallet. Aster requires both to function
    properly.</p>

<div class="drop-wrapper">
    <FileDrop on:droppedFile={droppedFile} success={validatedFile}
              initialText="Please drop a keyfile here, or click to select!"
              successText="Logging you in now..."
              failureText="That doesn't look like an Arweave keyfile"/>
</div>
