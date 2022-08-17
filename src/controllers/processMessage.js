const APP = require('gnodejs') // import app gnodejs

module.exports = async (CONTROLLERS, wallet, message, skipActions) => {
  // export module
  CONTROLLERS.mgo.insert(CONTROLLERS.db, 'whatsAppLogInbound', message) // insert message
  if (!CONTROLLERS.isAllowed(message.from)) {
    // check allowed
    return // return
  }
  const searchForUser = { route: message.route } // search for user
  if (message.from && message.from.id) {
    // check from
    searchForUser['number.id'] = message.from.id // number id
  } else {
    // if not from id
    searchForUser.number = message.from // number
  }
  const coinUser = await CONTROLLERS.mgo.singleQuery(
    // get user
    CONTROLLERS.db, // db
    'Users', // collection
    searchForUser // search for
  )
  if (coinUser) {
    // check user
    await CONTROLLERS.mgo.update(
      // update
      CONTROLLERS.db, // db
      'Users', // collection
      { _id: CONTROLLERS.mgo.id(coinUser._id) }, // search for
      {
        lastMessage: message.text ? message.text : '', // last message
        lastMessageOn: new Date(), // last message on
        msg30Sec: false, // msg 30 sec
        msg1Min: false, // msg 1 min
        msg3Min: false, // msg 3 min
        msg5Min: false, // msg 5 min
        msg10Min: false, // msg 10 min
        msgHour: false, // msg hour
        msgDay: false, // msg day
      }
    )
    const searchFor = { user: CONTROLLERS.mgo.id(coinUser._id), active: true } // search for
    const isPending = // check pending
      new Date().getTime() - // time
        (coinUser.pendingTime ? coinUser.pendingTime.getTime() : 0) < // time
      5 * 60 * 1000 // 5 min
    if (message.text && message.text.substr(0, 1) == '/') {
      // if text
      message.text = message.text.substr(1) // text
    }
    const buff = message.text // buff
      ? APP.replaceAll('\n', ' ', message.text) // replace all
          .trim() // trim
          .split(' ') // split
      : [] // if not text
    if (isPending) {
      // if pending
      for (let i = 0; i < buff.length; i++) {
        // for buff
        if (buff[i].toLowerCase() == coinUser.pending.toLowerCase()) {
          // if buff
          buff.splice(i, 1) // buff
        }
      }
    }
    let wallets = await CONTROLLERS.mgo.query(
      // get wallets
      CONTROLLERS.db, // db
      'Wallets', // collection
      searchFor // search for
    )
    await CONTROLLERS.mgo.update(
      // update
      CONTROLLERS.db, // db
      'Users', // collection
      { _id: CONTROLLERS.mgo.id(coinUser._id) }, // search for
      { pendingTime: null, pending: null } // update
    )
    const keyword = buff.length > 0 ? CONTROLLERS.keywords(buff[0]) : null // keyword
    if (
      // check keyword
      isPending // is pending
        ? coinUser.pending // pending
        : keyword == 'stay' || !coinUser.blocked // keyword
        ? keyword // keyword
        : null // if not keyword
    ) {
      switch (
        isPending ? coinUser.pending : keyword // switch
      ) {
        case 'wallet': // wallet
          await CONTROLLERS.wallets(CONTROLLERS, coinUser, wallets) // wallets
          break // break
        case 'deposit': // deposit
          await CONTROLLERS.deposit(CONTROLLERS, coinUser, wallets, buff) // deposit
          break // break
        case 'block': // block
          await CONTROLLERS.block(CONTROLLERS, coinUser, message) // block
          break // break
        case 'stay': // stay
          await CONTROLLERS.stay(CONTROLLERS, coinUser, message) // stay
          break // break
        case 'quiet': // quiet
          await CONTROLLERS.quietLoud(CONTROLLERS, coinUser, message, false) // quiet
          break // break
        case 'loud': // loud
          await CONTROLLERS.quietLoud(CONTROLLERS, coinUser, message, true) // loud
          break // break
        case 'send': // send
          if (!isPending || !coinUser.pending) {
            // if not pending
            buff.shift() // shift
          }
          await CONTROLLERS.banq.run('send', [coinUser, buff], true) // send
          break // break
        case 'sendConfirm': // send confirm
          if (
            // check
            buff // buff
              .shift() // shift
              .toLowerCase() // to lower case
              .trim() == 'yes' // if yes
          ) {
            await CONTROLLERS.banq.run('sendConfirm', [coinUser, false], true) // send confirm
          }
          await CONTROLLERS.mgo.update(
            // update
            CONTROLLERS.db, // db
            'Users', // collection
            { _id: CONTROLLERS.mgo.id(coinUser._id) }, // search for
            { sendTo: null } // update
          )
          break // break
        case 'price': // price
          await CONTROLLERS.messages.message(
            // message
            message.route, // route
            message.from, // from
            coinUser.language, // language
            'prices', // text
            [CONTROLLERS.prices.getCurrencyPriceList(coinUser.cur).join('\n')] // text
          )
          break // break
        case 'settings': // settings
          const uniqueSettingsCode = APP.randomString(7) // unique settings code
          const settingsExpires = new Date() // settings expires
          settingsExpires.setHours(settingsExpires.getHours() + 3) // settings expires
          const linkCode3 = await CONTROLLERS.shortLink.add(
            // add short link
            'https://caspergo.io/start/' + uniqueSettingsCode, // link
            3 * 60 // 3 min
          )
          await CONTROLLERS.mgo.update(
            // update
            CONTROLLERS.db, // db
            'Users', // collection
            { _id: CONTROLLERS.mgo.id(coinUser._id) }, // search for
            { settingsCode: uniqueSettingsCode, settingsExpires } // update
          )
          await CONTROLLERS.messages.message(
            // message
            message.route, // route
            message.from, // from
            coinUser.language, // language
            'settings', // text
            ['https://lg.cr/' + linkCode3] // text
          )
          break // break
        case 'history': // history
          const historyCode = APP.randomString(7) // history code
          const historyExpires = new Date() // history expires
          historyExpires.setHours(historyExpires.getHours() + 3) // history expires
          await CONTROLLERS.mgo.update(
            // update
            CONTROLLERS.db, // db
            'Users', // collection
            { _id: CONTROLLERS.mgo.id(coinUser._id) }, // search for
            { historyCode, historyExpires } // update
          )
          const linkCode1 = await CONTROLLERS.shortLink.add(
            // add short link
            'https://caspergo.io/history/' + historyCode, // link
            3 * 60 // 3 min
          )
          https: await CONTROLLERS.messages.message(
            // message
            message.route, // route
            message.from, // from
            coinUser.language, // language
            'history', // text
            ['https://lg.cr/' + linkCode1] // text
          )
          break // break
        case 'menu': // menu
          await CONTROLLERS.messages.message(
            // message
            message.route, // route
            message.from, // from
            coinUser.language, // language
            'menu', // text
            [] // text
          )
          break // break
        case 'support': // support
          const linkCode2 = await CONTROLLERS.shortLink.add(
            // add short link
            'https://casprgo.io/help/' + coinUser._id, // link
            3 * 60 // 3 min
          )
          await CONTROLLERS.messages.message(
            // message
            message.route, // route
            message.from, // from
            coinUser.language, // language
            'support', // text
            ['https://lg.cr/' + linkCode2] // text
          )
          break // break
        case 'staking': // staking
          await CONTROLLERS.messages.message(
            // message
            message.route, // route
            message.from, // from
            coinUser.language, // language
            'staking', // text
            [] // text
          )
          break // break
        case 'lottery': // lottery
          await CONTROLLERS.messages.message(
            // message
            message.route, // route
            message.from, // from
            coinUser.language, // language
            'lottery', // text
            [] // text
          )
          break // break
        case 'share': // share
          await CONTROLLERS.banq.run('share', [coinUser, message, buff], true) // share
          break // break
        case 'earning': // earning
          await CONTROLLERS.earning(CONTROLLERS, coinUser, message) // earning
          break // break
        case 'paymentrequest': // payment request
          if (buff[0].toLowerCase().trim() == 'yes') {
            // if yes
            coinUser.sendTo = {
              // send to
              coinName: coinUser.paymentRequest.coin.toLowerCase(), // coin name
              amount: coinUser.paymentRequest.amount, // amount
            }
            const sourceAccount = await CONTROLLERS.mgo.singleQuery(
              // source account
              CONTROLLERS.db, // db
              'Wallets', // collection
              {
                user: CONTROLLERS.mgo.id(coinUser._id), // user
                coin: coinUser.paymentRequest.coin.toLowerCase(), // coin
                active: true, // active
              }
            )
            const destUser = await CONTROLLERS.mgo.singleQuery(
              // dest user
              CONTROLLERS.db, // db
              'Users', // collection
              {
                number: coinUser.paymentRequest.destination, // number
                active: true, // active
              }
            )
            const destAccount = destUser // dest account
              ? await CONTROLLERS.mgo.singleQuery(CONTROLLERS.db, 'Wallets', {
                  // dest account
                  user: CONTROLLERS.mgo.id(destUser._id), // user
                  coin: coinUser.paymentRequest.coin.toLowerCase(), // coin
                  active: true, // active
                })
              : null
            if (
              sourceAccount && // if source account
              destAccount && // if dest account
              sourceAccount.staking - // if source account staking
                (sourceAccount.held ? sourceAccount.held : 0) >= // if source account staking
                coinUser.paymentRequest.amount // if source account staking
            ) {
              await CONTROLLERS.mgo.update(CONTROLLERS.db, 'Users', {
                // update
                _id: CONTROLLERS.mgo.id(coinUser._id), // search for
                paymentRequestCompleted: new Date(), // payment request completed
              })
              await CONTROLLERS.banq.run(
                'sendInternal',
                [
                  // send internal
                  coinUser, // coin user
                  destUser, // dest user
                  sourceAccount, // source account
                  destAccount, // dest account
                ],
                true
              )
            }
          }
          break // break
      }
    }
  } else {
    // if not message
    await CONTROLLERS.banq.run(
      'addAccount',
      [
        // add account
        wallet, // wallet
        message.from, // from
        message.route, // route
        'english', // language
        'USD', // currency
      ],
      true
    )
  }
}
