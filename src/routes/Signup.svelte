<script>
    import FileDrop from '../components/FileDrop.svelte'

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
                })
            } catch (e) {
                validatedFile = false
            }
        }
        reader.readAsBinaryString(e.detail)
    }
</script><!--a page for users to log in-->
<p class="is-size-3 mb-2">Experse Signup</p>


<div class="field mt-2">
    <label class="label">Username</label>
    <div class="control has-icons-left has-icons-right">
        <input class="input is-link" type="text" placeholder="Username">
        <span class="icon is-small is-left">
      <i class="fas fa-user"></i>
    </span>
        <span class="icon is-small is-right">
      <i class="fas fa-check"></i>
    </span>
    </div>
    <p class="help is-link">This username is available</p>
</div>

<div class="field mt-2">
    <label class="label">
        Please select a profile photo (.jpg), under 500kb
    </label>
    <div class="drop-wrapper">
        <FileDrop
                on:droppedFile={droppedFile}
                success={validatedFile}
                initialText="Please drop a keyfile here, or click to select!"
                successText="Logging you in now..."
                failureText="That doesn't look like an Arweave keyfile"/>
    </div>
</div>



<div class="field mt-2">
    <label class="label">
        Please select an Arweave keyfile
    </label>
    <div class="drop-wrapper">
        <FileDrop
                on:droppedFile={droppedFile}
                success={validatedFile}
                initialText="Please drop a keyfile here, or click to select!"
                successText="Logging you in now..."
                failureText="That doesn't look like an Arweave keyfile"/>
    </div>
</div>


<a class="mt-1 button is-pulled-right is-link is-large">Sign Up</a>
