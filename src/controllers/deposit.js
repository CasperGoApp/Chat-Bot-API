const qr = require('qr-image')  // qr

const coinList = {  // coin list
  divi: ['divi', 'divicoin'], // divi
  btc: ['btc', 'btccoin', 'bitcoin'] // btc
} // coin list

module.exports = async (CONTROLLERS, coinUser, wallets, searchArray) => { // export module
  let foundCoin = null  // found coin
  let returnQR = null // return qr
  let onlyPlus = false  // only plus
  let showAll = false // show all
  for (let i = 0; i < searchArray.length && !returnQR; i++) { // for
    if (['qr', 'code'].includes(searchArray[i].toLowerCase())) {  // if
      returnQR = true // return qr
    } 
  } 
  for (let i = 0; i < searchArray.length && !onlyPlus; i++) { // for
    if (['+', 'plus'].includes(searchArray[i])) { // if
      onlyPlus = true // only plus
    } 
  }
  for (let x in coinList) {   // for
    for (let i = 0; i < searchArray.length && !foundCoin; i++) {  // for
      onlyPlus = onlyPlus || searchArray[i].substr(-1) == '+' // only plus
      if (coinList[x].includes(searchArray[i].toLowerCase())) { // if
        foundCoin = x // found coin
      } else if ( // if
        onlyPlus && // only plus
        coinList[x].includes( // includes
          searchArray[i].substr(0, searchArray[i].length - 1).toLowerCase() // substring
        ) // includes
      ) { 
        foundCoin = x // found coin
      }
    }
  }
  for (let i = 0; i < searchArray.length && !onlyPlus; i++) { // for
    if ('all' == searchArray[i]) {  // if
      showAll = true  // show all
    }
  }
  let hasPlusAccounts = false // has plus accounts
  for (let i = 0; i < wallets.length && !hasPlusAccounts; i++) {  // for
    hasPlusAccounts = wallets[i].manual // has plus accounts
  }
  if (wallets.length > 1 && foundCoin) {  // if
    let walletList = [] // wallet list
    for (let i = 0; i < wallets.length; i++) {  // for
      if (
        foundCoin == wallets[i].coin.toLowerCase() && // found coin
        (showAll || // show all
          (onlyPlus && wallets[i].manual) ||  // only plus
          (!onlyPlus && !wallets[i].manual))  // not only plus
      ) {
        walletList.push(wallets[i]) // wallet list
      }
    }
    wallets = walletList  // wallets
  }
  if (wallets.length == 1) {  // if
    //if is custodial ... send notice 
    await CONTROLLERS.messages.send.text( // send text
      coinUser.route, // route
      coinUser.number,  // number 
      wallets[0].address  // address
    )
    if (returnQR) { // if
      let qr_svg = qr.imageSync(wallets[0].coin + ':' + wallets[0].address, { // qr svg
        type: 'png' // type
      })  // qr svg
      await CONTROLLERS.messages.send.file( // send file
        coinUser.route, // route
        coinUser.number,  // number
        '', // file
        qr_svg.toString('base64'),  // base64
        'png' // type
      )// send file
    } 
  } else {
    let messageText = coinUser.username // message text
      ? coinUser.username //  username
      : coinUser.number && coinUser.number.id //  number
      ? coinUser.number.id  //  number id
      : coinUser.number //  number
    for (let x in coinList) { // for
      for (let i = 0; i < wallets.length; i++) {  // for
        if (x.toUpperCase() == wallets[i].coin.toUpperCase()) { // if
          messageText +=  //  message text
            '\n' +  // new line
            wallets[i].coin  // coin
              .toUpperCase()  // upper case
              .padStart(5, ' ') + // pad start
            (wallets[i].manual ? '+' : ' ') + // plus
            ': ' +    // colon
            wallets[i].address  // address
        } 
      }
    }
    await CONTROLLERS.messages.message( // message
      coinUser.route, // route
      coinUser.number,  // number
      coinUser.language,  // language
      'deposit',  // type
      [ // params
        messageText,  // message text
        hasPlusAccounts // has plus accounts
          ? '\nSend ```deposit divi+``` to get ONLY the DIVI address for your plus account' //  message text
          : ''  //  message text
      ] // params
    ) // message
  }
}
