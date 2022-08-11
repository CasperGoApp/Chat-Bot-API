require('dotenv').config() // import .env
const APP = require('gnodejs') // import app from gnodejs
const fetch = require('node-fetch') // import fetch
const qr = require('qr-image') // import qr-image
const speakeasy = require('speakeasy') // import speakeasy

// declaring CONTROLLERS object
const CONTROLLERS = {
  db: process.env.MONGO_DBNAME, // database name from env
  mgo: require('gmongo'), // import gmongo
  banq: require('./banq'), // import banq
  messages: require('./messages'), // import messages controller
  block: require('./controllers/block'), // import block controller
  checkUsername: require('./controllers/checkUsername'), // import checkUsername controller
  deposit: require('./controllers/deposit'), // import deposit controller
  earning: require('./controllers/earning'), // import earning controller
  isAllowed: require('./controllers/isAllowed'), // import isAllowed controller
  keywords: require('./controllers/keywords'), // import keywords controller
  prices: require('./controllers/prices'), // import prices controller
  processMessage: require('./controllers/processMessage'), // import processMessage controller
  quietLoud: require('./controllers/quietLoud'), // import quietLoud controller
  shortLink: require('./controllers/shortLink'), // import shortLink controller
  stay: require('./controllers/stay'), // import stay controller
  wallets: require('./controllers/wallets'), // import wallets controller
  xlsx: require('./controllers/xlsx') // import xlsx controller
}

// enable/disable TESTNET from env
const TESTNET = process.env.WALLET_TESTNET == 'true'

// declare wallet
let wallet = null

// declare saveUpdate function to save and update message
const saveUpdate = async updateToMessage => console.log(updateToMessage)

// start CONTROLLERS with gmongo connection and pass providers
CONTROLLERS.messages.start(
  CONTROLLERS, // controllers object 
  [],//['telegram', 'signal'], // providers array
  message => // message callback
    CONTROLLERS.mgo.insert(CONTROLLERS.db, 'logOutbound', { // insert message to logOutbound collection
      ...message, // spread message
      ...{ on: new Date() } // add on date
    })
)
APP.xpr.load() // load xpr

APP.xpr.add('get', '/securePassword', async res => // add securePassword route
  res.end(await CONTROLLERS.banq.run('coins.encryption.key.create', [], false)) //return key
)

APP.xpr.add('get', '/BM/:fileID', (res, ip, req) => { // add BM File route
  CONTROLLERS.messages.bm.sendFile(req.fileID, res) // send file
})

APP.xpr.add('post', '/WhatsApp', (res, ip, req) => // add WhatsApp route
  CONTROLLERS.messages.CT.receive( // receive message
    req, // request
    (message, skipActions) => // message callback
      CONTROLLERS.processMessage(CONTROLLERS, wallet, message, skipActions), // process message
    saveUpdate, // save update
    res // response
  )
)
APP.xpr.add('post', '/BM', (res, ip, req) => // add Botmaker route
  CONTROLLERS.messages.BM.receive( // receive message
    req, // request
    (message, skipActions) => // message callback
      CONTROLLERS.processMessage(CONTROLLERS, wallet, message, skipActions), // process message
    saveUpdate, // save update
    res // response
  )
)

APP.xpr.add('get', '/history/:id', async (res, ip, req) => { // add history route
  const coinUser = await CONTROLLERS.mgo.singleQuery(CONTROLLERS.db, 'Users', { // get coin user
    historyCode: req.id, // history code
    historyExpires: { $gt: new Date() }, // history expires
    active: true  // active
  })
  if (coinUser) { // if coin user
    const coinWallets = await CONTROLLERS.mgo.query(CONTROLLERS.db, 'Wallets', {  // get coin wallets
      user: CONTROLLERS.mgo.id(coinUser._id), // user
      active: true  // active
    })
    if (coinWallets && coinWallets.length > 0) {  // if coin wallets
      CONTROLLERS.history(CONTROLLERS, coinWallets, res)  // history
      return  // return
    }
  }
  kickOut(res)  // kick out
})

APP.xpr.add('get', '/help/:id', async (res, ip, req) => { // add help route
  const coinUser = await CONTROLLERS.mgo.singleQuery(CONTROLLERS.db, 'Users', { // get coin user
    _id: CONTROLLERS.mgo.id(req.id),  // id
    active: true  // active
  })
  if (coinUser) { // if coin user
    res.sendFile(__dirname + '/html/help.html') // send help.html
    return
  }
  kickOut(res)  // kick out
})

APP.xpr.add('post', '/getAdvancedLink', async (res, ip, req) => { // add get advanced link route
  const coinUser = await CONTROLLERS.mgo.singleQuery(CONTROLLERS.db, 'Users', { // get coin user
    amlCode: req.id,  // aml code
    active: true  // active
  })
  if (coinUser && coinUser.aml && coinUser.aml.block) { // if coin user
    const uniqueSettingsCode = APP.randomString(7)  // unique settings code
    const settingsExpires = new Date()  // settings expires
    settingsExpires.setHours(settingsExpires.getHours() + 3)  // settings expires
    await CONTROLLERS.mgo.update( // update settings
      CONTROLLERS.db, // db
      'Users',  // collection
      { _id: CONTROLLERS.mgo.id(coinUser._id) },  // query
      { settingsCode: uniqueSettingsCode, settingsExpires } // update
    )
    res.json(uniqueSettingsCode)  // json unique settings code
    return
  }
  kickOut(res)  // kick out
})

APP.xpr.add('get', '/start/:phoneID', async (res, ip, req) => { // add start route
  const phoneAccount = await CONTROLLERS.mgo.singleQuery( // get phone account
    CONTROLLERS.db, // db
    'Users',  // collection
    {
      settingsCode: req.phoneID,  // settings code
      settingsExpires: { $gt: new Date() }, // settings expires
      active: true  // active
    }
  )
  if (phoneAccount) { // if phone account
    const printData = ['cur', 'language', '_id', 'username']  // print data
    const phoneAccountData = {} // phone account data
    for (let i = 0; i < printData.length; i++) {  // for each print data
      phoneAccountData[printData[i]] = phoneAccount[printData[i]] // phone account data
    }
    res.end(  // end
      APP.files // files
        .read(__dirname + '/html/account.html') // read account.html
        .replace('ROUTENAME', phoneAccount.route) // replace route
        .replace( // replace
          'PHONENUMBER',  // phone number
          phoneAccount.number && phoneAccount.number.id // if phone number
            ? phoneAccount.number.id  // id
            : phoneAccount.number // number
        )
        .replace('PHONEID', phoneAccount._id) // replace phone id
        .replace('USER_INFORMATION', JSON.stringify(phoneAccountData))  // replace user information
    )
  } else {
    kickOut(res)  // kick out
  }
})

APP.xpr.add('get', '/blocked/:id', async (res, ip, req) => {  // add blocked route
  const phoneAccount = await CONTROLLERS.mgo.singleQuery( // get phone account
    CONTROLLERS.db, // db
    'Users',  // collection
    {
      amlCode: req.id,  // aml code
      active: true  // active
    }
  )
  if (phoneAccount && phoneAccount.aml && phoneAccount.aml.block) { // if phone account
    const deposited = await CONTROLLERS.banq.run('aml.getTotalDeposited', [phoneAccount._id], false)
    const overage = deposited - phoneAccount.aml.limit  // overage
    res.end(  // end
      APP.files // files
        .read(__dirname + '/html/blocked.html') // read blocked.html
        .replace('PHONEID', req.id) // replace phone id
        .replace('AML_LIMIT', APP.addCommas(phoneAccount.aml.limit.toFixed(2))) // replace aml limit
        .replace('TOTAL_MONTHLY', APP.addCommas(deposited.toFixed(2)))  // replace total monthly
        .replace('TOTAL_OVERAGE', APP.addCommas(overage.toFixed(2)))  // replace total overage
    )
  } else {  // if not phone account
    kickOut(res)  // kick out
  }
})

APP.xpr.add('post', '/share/confirm', async (res, ip, req) => { // add share confirm route
  const coinUser = await CONTROLLERS.mgo.singleQuery(CONTROLLERS.db, 'Users', { // get coin user
    _id: CONTROLLERS.mgo.id(req.userID) // id
  })
  const existingAccount = await CONTROLLERS.mgo.singleQuery(  // get existing account
    CONTROLLERS.db, // db
    'Users',  // collection
    {
      number: req.phone // number
    }
  )
  if (coinUser && !existingAccount) { // if coin user
    await CONTROLLERS.banq.run('share', [coinUser, coinUser, [  // share
      'share',  // share
      req.phone // phone
    ]], true)
    res.end('1')  // end
  } else {
    res.end('0')  // end
  }
})

APP.xpr.add('post', '/username/check', async (res, ip, req) => {  // add username check route
  if (  
    req.username && // if username
    req.username.trim().length > 4 && // if username
    APP.onlyNums(req.username.trim()) != req.username.trim()  // if username
  ) {
    res.json(await CONTROLLERS.checkUsername(CONTROLLERS, req.username))  // json username check
  } else {  // if not username
    res.json(false) // json false
  } 
})

APP.xpr.add('post', '/add', async (res, ip, req) => { // add add route
  CONTROLLERS.banq.run('updateAccount', [req], true)
  res.json(true)  // json true
})

APP.xpr.add('post', '/gotTX', async (res, ip, req) => { // add got tx route
  if (process.env.ALLOWED_TX_IPS.split(',').includes(ip)) { // if allowed tx ips
    res.end('ok') // end
    CONTROLLERS.banq.run('processBlockTransaction', [req.block,    // block
    req.coin,   // coin
    req.address,    // address
    req.transactions,   // transactions
    req.location ? req.location : null], true)
  } else {  // if not allowed tx ips
    kickOut(res)  // kick out
  }
})

// start connection to bot
APP.xpr.add('get', '/start', res =>  // add start route
  res.redirect( // redirect
    'https://wa.me/' +  // redirect
      APP.onlyNums(process.env.SOURCE_NUMBER) + // number
      '?text=' +  // text
      encodeURIComponent('I want to get started with CasperGo') // message
  )
)

APP.xpr.add('get', '/newaddress/:coin', async (res, ip, req) => { // add new address route
  const addr = await CONTROLLERS.banq.run('getNextAddress', [
  req.coin.toLowerCase()], false)
  res.json(addr)  // json
})

APP.xpr.add('get', '/tfa/verify/:base32/:code', (res, ip, req) => // add tfa verify route
  res.json( // json
    speakeasy.totp.verify({ // verify
      secret: req.base32, // secret
      encoding: 'base32', // encoding
      token: req.code,  // code
      window: 45  // window
    })
  )
)

APP.xpr.add('get', '/qr/tfa/:name/:code', (res, ip, req) => { // add tfa qr route
  res.setHeader('Content-type', 'image/svg+xml')  // set header
  qr.image('otpauth://totp/' + req.name + '?secret=' + req.code, {  // qr
    type: 'svg' // type
  }).pipe(res)  // pipe
})

APP.xpr.add('post', '/ghUD', async (res, ip, req) => {  // add ghUD route
  const ghData = APP.parse(req.payload) // parse
  console.log(ghData)
  res.end('ok')  // send
  if (  // if
    ghData && // gh data
    ghData.repository &&  // if repository
    ghData.repository.id && // if id
    ghData.repository.id == process.env.REPO_ID &&  // if repo id
    ghData.repository.full_name &&  // if full name
    ghData.repository.full_name == process.env.REPO_NAME  // if repo name
  ) { 
    console.log('Load from Github Update')  // log
    APP.shell(  // shell
      'cd ' + process.env.REPO_ROOT + ' ; rm package-lock.json ; git pull'  // command
    ) // shell
    APP.shell('cd ' + process.env.REPO_ROOT + ' ; npm i') // shell
    APP.shell('pm2 reload all')  // shell
  }
})

APP.xpr.add('get', '/:username', async (res, ip, req) => {  // add username route
  const phoneAccount = await CONTROLLERS.mgo.singleQuery( // single query
    CONTROLLERS.db, // db
    'Users',  // collection
    {
      active: true, // active
      $or: [{ username: req.username }, { number: APP.onlyNums(req.username) }] // or
    }
  )
  if (phoneAccount) { // if phone account
    res.end(  // end
      APP.files // files
        .read(__dirname + '/html/share.html') // read
        .replace('PHONEID', phoneAccount._id) // replace
    ) // replace
  } else {  // else
    kickOut(res)  // kick out
  }
})

const kickOut = res => res.redirect('https://caspergo.io')  // kick out

APP.xpr.add('all', '*', res => kickOut(res)) // add all route

// start function 
const start = async _ => {  // start
  const started = new Date()  // started
  CONTROLLERS.prices.load(CONTROLLERS)  // load prices

  await CONTROLLERS.mgo.start( // start mgo
    process.env.MONGO_ATLAS == 'true', // if mongo atlas
    CONTROLLERS.db, // db
    process.env.MONGO_URL, // mongo url
    null, // param
    process.env.MONGO_USER, // mongo user
    process.env.MONGO_PASS, // mongo pass
    null, // param
    parseInt(process.env.MONGO_TIMEOUT) // mongo timeout
  )

  await APP.xpr.start(process.env.SERVER_PORT)  // start xpr
  console.log(  // log
    process.env.SERVER_NAME + // server name
      ' online in ' + // online in
      parseInt((new Date().getTime() - started.getTime()) / 1000) + // parse int
      's' // s
  ) // log

} // start

start() // start
