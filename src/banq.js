require('dotenv').config() // import .env
const fetch = require('node-fetch')
const fs = require('fs')

let id = fs.existsSync('./id.txt') ? fs.readFileSync('./id.txt', 'utf8') : 0

const banq = {
  start: async (_) => {},
  getID: (_) => {
    id++
    fs.writeFileSync('./id.txt', id.toString())
    return id
  },
  run: async (method, params, addControllers) => {
    const result = await (
      await fetch(process.env.BANQ_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: banq.getID(),
          method,
          params,
          key: process.env.BANQ_RPC_API_KEY,
          addControllers,
        }),
      })
    ).json()
    if (result.error) {
      throw result.error
    } else {
      return result.result
    }
  },
}

module.exports = banq

/*
const main = async () => {
    //const response = await banq.run('coins.address.getNew', ['divi', false, 0], false)
    const response = await banq.run('prices.formatCrypto', ['divi', 100, 'USD'], false)
}
main()*/
