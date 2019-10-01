import { arweave, EXPERSE_PROFILE_TAG, EXPERSE_USERNAME_TAG } from './constants'
import * as _ from 'lodash'

export class api {
    static readFile(e) {
        e.preventDefault()
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onloadend = ev => {
                resolve(ev.target.result)
            }
            reader.onerror = ev => {
                reject(ev.target.error)
            }
            if (e.detail.type === 'application/json') {
                reader.readAsBinaryString(e.detail)
            } else {
                reader.readAsDataURL(e.detail)
            }
        })
    }

    static allOfQuery(query) {
        let results = []
        return new Promise((resolve, reject) => {
            arweave
                .arql(query)
                .then(queryResult => {
                    queryResult.forEach(tx => {
                        arweave.transactions
                            .get(tx)
                            .then(txResult => {
                                results.push(txResult)
                                if (results.length === queryResult.length) {
                                    resolve(results)
                                }
                            })
                            .catch(e => {
                                reject(e)
                            })
                    })
                })
                .catch(e => {
                    reject(e)
                })
        })
    }

    static oneOfQuery(query) {
        return new Promise((resolve, reject) => {
            arweave
                .arql(query)
                .then(queryResult => {
                    var tx = queryResult[0]
                    arweave.transactions
                        .get(tx)
                        .then(txResult => {
                            resolve(txResult)
                        })
                        .catch(e => {
                            reject(e)
                        })
                })
                .catch(e => {
                    reject(e)
                })
        })
    }

    static retrieveUserProfile(profileAddr, processResult) {
        api.oneOfQuery({
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: EXPERSE_PROFILE_TAG,
                expr2: 'true',
            },
            expr2: {
                op: 'equals',
                expr1: 'from',
                expr2: profileAddr,
            },
        }).then(queryResult => {
            processResult(queryResult)
        })
    }

    static profileByName(name, processResult) {
        api.oneOfQuery({
            op: 'equals',
            expr1: EXPERSE_USERNAME_TAG,
            expr2: name,
        }).then(queryResult => {
            processResult(txResult)
        })
    }

    static sendTransaction(data, wallet, tags) {
        return new Promise((resolve, reject) => {
            arweave
                .createTransaction(
                    {
                        data: data,
                    },
                    wallet
                )
                .then(pTx => {
                    for (let itm in tags) {
                        pTx.addTag(itm, tags[itm])
                    }
                    arweave.api.get('/tx_anchor').then(anchor_id => {
                        pTx.last_tx = anchor_id.data
                        arweave.transactions
                            .sign(pTx, wallet)
                            .then(() => {
                                arweave.transactions
                                    .post(pTx)
                                    .then(pResponse => {
                                        if (pResponse.status === 200) {
                                            resolve(pTx)
                                        } else {
                                            reject(pResponse)
                                        }
                                    })
                                    .catch(e => {
                                        reject(e)
                                    })
                            })
                            .catch(e => {
                                reject(e)
                            })
                    })
                })
        })
    }

    static signupUser(profile) {
        return this.sendTransaction(JSON.stringify(_.omit(profile, 'wallet')), profile.wallet, {
            [EXPERSE_PROFILE_TAG]: 'true',
            [EXPERSE_USERNAME_TAG]: profile.username,
        })
    }
}
