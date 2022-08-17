const APP = require('gnodejs') // import app gnodejs

const coinList = {
  // coin list
  divi: ['divi', 'divicoin'], // divi
  btc: ['btc', 'btccoin', 'bitcoin'],
}

module.exports = async (CONTROLLERS, coinUser, wallets) => {
  // export module
  const isSingle = wallets.length == 1 // is single
  let messageText = '' // message text
  let lastMessages = '' // last messages
  for (let x in coinList) {
    // for coin list
    for (let i = 0; i < wallets.length; i++) {
      // for wallets
      if (x.toUpperCase() == wallets[i].coin.toUpperCase()) {
        // if coin list
        const balance = wallets[i].staking
          ? wallets[i].staking
          : wallets[i].balance // balance
        const rowData = // row data
          balance && balance > 0 // balance
            ? CONTROLLERS.prices // prices
                .formatCrypto(wallets[i].coin, balance, coinUser.cur) // format crypto
                .split(' ') // split
            : [0, '', ''] // row data
        const thisRow = // this row
          (isSingle // is single
            ? ''
            : wallets[i].coin // wallets
                .toUpperCase()
                .padStart(5, ' ') +
              (wallets[i].manual ? '+' : ' ') +
              ': ') +
          parseFloat(parseFloat(rowData[0]).toFixed(4))
            .toString()
            .padStart(8, ' ') +
          ' ' +
          rowData[2] +
          '\n'
        if (balance > 0) {
          // if balance
          messageText += thisRow // message text
        } else {
          // if balance
          lastMessages += thisRow // last messages
        }
      }
    }
  }
  await CONTROLLERS.messages.message(
    // message
    coinUser.route, // route
    coinUser.number, // number
    coinUser.language, // language
    'wallets', // message
    [
      isSingle ? wallets[0].coin.toUpperCase() + '' : 's', // is single
      coinUser.username
        ? coinUser.username
        : coinUser.number && coinUser.number.id // number
        ? coinUser.number.id // number
        : coinUser.number, // number
      messageText + lastMessages, // message text
    ]
  )
}
