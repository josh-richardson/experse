import { arweave, EXPERSE_PROFILE_TAG } from './constants'
import * as _ from 'lodash'
import { api } from './api'

export class transactionPool {
    constructor() {
        this.pendingTransactions = []
    }

    submitTransaction(tx) {
        if (!this.pendingTransactions.contains(tx)) {
            this.pendingTransactions.push(tx)
        }
    }

    isFinished() {
        return this.pendingTransactions.length === 0
    }

    beginProcessing() {
        console.log('Starting to process transactions')
        let currentTransaction = undefined
        let broadcastTransaction = undefined

        setInterval(() => {
            if (currentTransaction === undefined && !this.isFinished()) {
                currentTransaction = this.pendingTransactions.shift()
                api.sendTransaction(currentTransaction.data, currentTransaction.wallet, currentTransaction.tags).then(
                    response,
                    tx => {
                        broadcastTransaction = tx
                    }
                )
            }
            if (currentTransaction !== undefined && broadcastTransaction !== undefined) {
                arweave.transactions.getStatus(broadcastTransaction).then(response => {
                    if (response.status === 200) {
                        currentTransaction.callback(true)
                    }
                })
            }
        }, 15000)
    }
}
