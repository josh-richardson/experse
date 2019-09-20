import arweave from './constants'

export class api {
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


}
