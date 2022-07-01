require('dotenv').config()
const APP = require('gnodejs')

const coins = JSON.parse(process.env.NETWORK_NAMES)

const main = _=> {
  console.log(coins)
  for( let value of coins ) {
    const monitor = require('./' + value + '/')
    console.log('./' + value + '/')
    monitor.start(
      __dirname + '/' + value + '.addressList',
      __dirname + '/' + value + '.updateAddressList',
      (block, address, transactions) => 
        APP.fetch(
          process.env.POST_TX_TO,
          'post',
          {},
          { coin: value, block, address, transactions }
        )
    )
  }
}
main()