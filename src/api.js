import {
    arweave,
    EXPERSE_COMMENT_POST_TAG,
    EXPERSE_COMMENT_TAG,
    EXPERSE_POST_TAG,
    EXPERSE_POST_UNIVERSE_TAG,
    EXPERSE_PROFILE_TAG,
    EXPERSE_UNIVERSE_NAME_TAG,
    EXPERSE_UNIVERSE_TAG,
    EXPERSE_UPDATE_ID_TAG,
    EXPERSE_UPDATE_TAG,
    EXPERSE_USERNAME_TAG,
    EXPERSE_SCORE_TAG,
    EXPERSE_SCORE_POST_TAG,
} from './constants'
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
        })
            .then(queryResult => {
                processResult(queryResult)
            })
            .catch(() => {
                processResult(false)
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

    static createUniverse(universe, profile) {
        return this.sendTransaction(JSON.stringify({ ...universe, date: new Date() }), profile.wallet, {
            [EXPERSE_UNIVERSE_TAG]: 'true',
            [EXPERSE_UNIVERSE_NAME_TAG]: universe.name,
        })
    }

    static allUniverses(processResult) {
        return api
            .allOfQuery({
                op: 'equals',
                expr1: EXPERSE_UNIVERSE_TAG,
                expr2: 'true',
            })
            .then(queryResult => {
                processResult(queryResult)
            })
    }

    static createPost(post, profile) {
        return this.sendTransaction(JSON.stringify({ ...post, date: new Date() }), profile.wallet, {
            [EXPERSE_POST_TAG]: 'true',
            [EXPERSE_POST_UNIVERSE_TAG]: post.universeId,
        })
    }

    static createComment(comment, profile) {
        return this.sendTransaction(JSON.stringify({ ...comment, date: new Date() }), profile.wallet, {
            [EXPERSE_COMMENT_TAG]: 'true',
            [EXPERSE_COMMENT_POST_TAG]: comment.postId,
        })
    }

    static createScore(score, profile) {
        return this.sendTransaction(JSON.stringify({ ...score, date: new Date() }), profile.wallet, {
            [EXPERSE_SCORE_TAG]: 'true',
            [EXPERSE_SCORE_POST_TAG]: score.postId,
        })
    }

    static commentsByPost(postId, processResult) {
        return api
            .allOfQuery({
                op: 'equals',
                expr1: EXPERSE_COMMENT_POST_TAG,
                expr2: postId,
            })
            .then(queryResult => {
                processResult(queryResult)
            })
    }

    static scoresByPost(postId, processResult) {
        return api
            .allOfQuery({
                op: 'equals',
                expr1: EXPERSE_SCORE_POST_TAG,
                expr2: postId,
            })
            .then(queryResult => {
                processResult(queryResult)
            })
    }

    static postsByUniverse(universe, processResult) {
        return api
            .allOfQuery({
                op: 'equals',
                expr1: EXPERSE_POST_UNIVERSE_TAG,
                expr2: universe,
            })
            .then(queryResult => {
                processResult(queryResult)
            })
    }

    static postsByUser(owner, processResult) {
        return api
          .allOfQuery({
              op: 'and',
              expr1: {
                  op: 'equals',
                  expr1: EXPERSE_POST_TAG,
                  expr2: 'true',
              },
              expr2: {
                  op: 'equals',
                  expr1: 'from',
                  expr2: owner,
              },
          })
          .then(queryResult => {
              processResult(queryResult)
          })
    }


    static allPosts(processResult) {
        return api
            .allOfQuery({
                op: 'equals',
                expr1: EXPERSE_POST_TAG,
                expr2: 'true',
            })
            .then(queryResult => {
                processResult(queryResult)
            })
    }

    static createUpdate(update, profile) {
        return this.sendTransaction(JSON.stringify({ ...update, date: new Date() }), profile.wallet, {
            [EXPERSE_UPDATE_TAG]: 'true',
            [EXPERSE_UPDATE_ID_TAG]: update.updatedContent,
        })
    }

    static updatesById(id, owner, processResult) {
        return api
            .allOfQuery({
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: EXPERSE_UPDATE_ID_TAG,
                    expr2: id,
                },
                expr2: {
                    op: 'equals',
                    expr1: 'from',
                    expr2: owner,
                },
            })
            .then(queryResult => {
                processResult(queryResult)
            })
    }

    static signupUser(profile) {
        return this.sendTransaction(JSON.stringify(_.omit(profile, 'wallet')), profile.wallet, {
            [EXPERSE_PROFILE_TAG]: 'true',
            [EXPERSE_USERNAME_TAG]: profile.username,
        })
    }
}
