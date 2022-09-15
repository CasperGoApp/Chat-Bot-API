const APP = require('gnodejs') // import gnodejs

//which coins will be based on a UTXO blockchain
const UTXOCoinList = ['btc', 'divi']

//all coins available to enable
const coinList = ['btc', 'divi', 'cspr']

//add function for export and use in the platform
module.exports = async (CONTROLLERS, wallet, number, route, language, cur) => {
  // addAccount
  //get existing user with this phone number
  const existing = await CONTROLLERS.mgo.singleQuery(CONTROLLERS.db, 'Users', {
    // getUser
    number, // phone number
    route, // route
  })
  //if user exists, cancel process
  if (existing) {
    // if user exists
    return null // return null
  }
  //get last user (to manage the private keys using an index)
  const lastUser = await CONTROLLERS.mgo.queryLimitSort(
    //get last user
    CONTROLLERS.db, //db
    'Users', //collection
    1, //limit
    { added: -1 }, //sort
    {} //query
  )
  //set wallet index for next user to last user + 1
  const walletIndex =
    (lastUser && lastUser.length == 1 && lastUser[0] && lastUser[0].walletIndex
      ? lastUser[0].walletIndex
      : 200) + 1 // set wallet index

  // Add new user
  const newUser = await CONTROLLERS.mgo.insert(CONTROLLERS.db, 'Users', {
    // addUser
    added: new Date(), // added
    number, // number
    route, // route
    active: true, // active
    language, // language
    cur, // currency
    walletIndex, // walletIndex
  })
  const addresses = [] // set addresses to empty array
  for (let i = 0; i < coinList.length; i++) {
    // for each coin
    // Get the next address available
    const addr = await CONTROLLERS.getNextAddress(
      // getNextAddress
      CONTROLLERS, // CONTROLLERS
      wallet, // wallet
      coinList[i], // coin
      walletIndex // walletIndex
    )
    const addrData = {
      // addrData
      user: CONTROLLERS.mgo.id(newUser.insertedId), // user
      coin: coinList[i], // coin
      added: new Date(), // added
      type: 'auto', // type
      address: addr, // address
      active: true, // active
    }
    addrData.index = walletIndex // index
    if (UTXOCoinList.includes(coinList[i])) {
      // if UTXO coin
      CONTROLLERS.daemons.addAddress(coinList[i], addr) // add address to daemon
    } else {
      // if coin is not UTXO
      addrData.address = addrData.address.split(':')[0] // address
    }
    if (coinList[i].toLowerCase() == 'divi') {
      // if coin is divi
      addrData.staking = referred && referred.amount ? referred.amount : 0 // staking
    }
    if (
      // if coin is not UTXO
      referral.coin == coinList[i] && // if referral coin is the same as the coin
      payFromAccount.balance <= referral.amountToSend // if payFromAccount balance is less than or equal to the amount to send
    ) {
      console.log('send', referral, 'to', addrData.address) // send
    }
    addresses.push(addrData) // push address
  }
  await CONTROLLERS.mgo.insert(CONTROLLERS.db, 'Wallets', addresses) // add addresses
  const uniqueSettingsCode = APP.randomString(7) // set uniqueSettingsCode
  const settingsExpires = new Date() // settingsExpires
  settingsExpires.setHours(settingsExpires.getHours() + 12) // settingsExpires
  await CONTROLLERS.mgo.update(
    // update
    CONTROLLERS.db, // db
    'Users', // collection
    { _id: CONTROLLERS.mgo.id(newUser.insertedId) }, // query
    { settingsCode: uniqueSettingsCode, settingsExpires } // update
  )
  const linkCode = await CONTROLLERS.shortLink.add(
    // add
    'https://caspergo.io/start/' + uniqueSettingsCode, // url
    3 * 60
  )
  await CONTROLLERS.messages.message(route, number, language, 'onboard', [
    // message
    'CasperGo', // app
    'To configure advanced settings, please click here: https://caspergo.io/' + // link
      linkCode + // link
      (referred && referred.amount && referred.amount > 0
        ? ", What's more? You have also received " + // if referral amount is greater than 0
          CONTROLLERS.prices.formatCrypto(referral.coin, referred.amount, cur) + // referral amount
          ' from your friend just for joining!' // referral amount
        : ''), // referral amount
  ])
  setTimeout(
    // setTimeout
    (_) => CONTROLLERS.messages.message(route, number, language, 'menu', []), // message
    20 * 1000 // 20 seconds
  )
  CONTROLLERS.setUsedAddresses(CONTROLLERS) // setUsedAddresses
  return newUser.insertedId // return newUser
}
