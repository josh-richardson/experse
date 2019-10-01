import Arweave from 'arweave/web'

const VERSION = 1

const arweave = Arweave.init({
    host: document.location.host.indexOf('localhost') !== -1 ? 'arweave.net' : document.location.host,
    port: 443,
    protocol: 'https',
})

const EXPERSE_TAG_PREFIX = 'dev-'

const EXPERSE_PROFILE_TAG = EXPERSE_TAG_PREFIX + 'experse-profile'
const EXPERSE_USERNAME_TAG = EXPERSE_TAG_PREFIX + 'experse-username'

export { VERSION, arweave, EXPERSE_PROFILE_TAG, EXPERSE_USERNAME_TAG }
