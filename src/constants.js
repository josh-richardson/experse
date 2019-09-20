import Arweave from 'arweave/web'

export const VERSION = 1

export const arweave = Arweave.init({
  host: document.location.host.indexOf('localhost') !== -1 ? 'arweave.net' : document.location.host,
  port: 443,
  protocol: 'https',
})
