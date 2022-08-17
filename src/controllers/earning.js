const APP = require('gnodejs') // import app gnodejs

module.exports = async (CONTROLLERS, coinUser, message) => {
  // export module
  const account = await CONTROLLERS.mgo.singleQuery(CONTROLLERS.db, 'Wallets', {
    // get account
    user: CONTROLLERS.mgo.id(coinUser._id), // user
    active: true, // active
    coin: 'divi', // coin
    type: 'auto', // type
  }) // get account
  if (account) {
    // check account
    const earnings = await CONTROLLERS.mgo.query(
      // get earnings
      CONTROLLERS.db, // db
      'diviPayoutLog', // collection
      {
        account: CONTROLLERS.mgo.id(account._id), // account
      }
    )
    let oneWeek = { on: new Date(), staking: 0, lottery: 0, ror: 0, rors: 0 } // one week
    oneWeek.on.setDate(oneWeek.on.getDate() - 7) // one week
    let oneMonth = { on: new Date(), staking: 0, lottery: 0, ror: 0, rors: 0 } // one month
    oneMonth.on.setMonth(oneMonth.on.getMonth() - 1) // one month
    let threeMonth = {
      on: new Date(),
      staking: 0,
      lottery: 0,
      ror: 0,
      rors: 0,
    } // three month
    threeMonth.on.setMonth(oneMonth.on.getMonth() - 3) // three month
    let oneYear = { on: new Date(), staking: 0, lottery: 0, ror: 0, rors: 0 } // one year
    oneYear.on.setMonth(oneMonth.on.getMonth() - 12) // one year
    let lifetime = {
      // lifetime
      on: new Date('2021-12-01T00:00:00'), // on
      staking: 0, // staking
      lottery: 0, // lottery
      ror: 0, // ror
      rors: 0, // rors
    }
    let totalStaking = 0 // total staking
    let totalLottery = 0 // total lottery
    for (let i = 0; i < earnings.length; i++) {
      // for earnings
      const thisRor = // this ror
        ((earnings[i].staking + earnings[i].lottery) / // staking + lottery
          earnings[i].myBalAtTime) * // my bal at time
        36500 // 36500
      if (earnings[i].on > oneWeek.on) {
        // check on
        oneWeek.staking += earnings[i].staking // one week staking
        oneWeek.lottery += earnings[i].lottery // one week lottery
        if (earnings[i].myBalAtTime) {
          // check my bal at time
          oneWeek.rors++ // one week rors
          oneWeek.ror += thisRor // one week ror
        } // check my bal at time
      }
      if (earnings[i].on > oneMonth.on) {
        // check on
        oneMonth.staking += earnings[i].staking // one month staking
        oneMonth.lottery += earnings[i].lottery // one month lottery
        if (earnings[i].myBalAtTime) {
          // check my bal at time
          oneMonth.rors++ // one month rors
          oneMonth.ror += thisRor // one month ror
        }
      }
      if (earnings[i].on > threeMonth.on) {
        // check on
        threeMonth.staking += earnings[i].staking // three month staking
        threeMonth.lottery += earnings[i].lottery // three month lottery
        if (earnings[i].myBalAtTime) {
          // check my bal at time
          threeMonth.rors++ // three month rors
          threeMonth.ror += thisRor // three month ror
        }
      }
      if (earnings[i].on > oneYear.on) {
        // check on
        oneYear.staking += earnings[i].staking // one year staking
        oneYear.lottery += earnings[i].lottery // one year lottery
        if (earnings[i].myBalAtTime) {
          // check my bal at time
          oneYear.rors++ // one year rors
          oneYear.ror += thisRor // one year ror
        }
      }
      if (earnings[i].on > lifetime.on) {
        // check on
        lifetime.staking += earnings[i].staking // lifetime staking
        lifetime.lottery += earnings[i].lottery // lifetime lottery
        if (earnings[i].myBalAtTime) {
          // check my bal at time
          lifetime.rors++ // lifetime rors
          lifetime.ror += thisRor // lifetime ror
        }
      }
      totalStaking += earnings[i].staking // total staking
      totalLottery += earnings[i].lottery // total lottery
    }
    await CONTROLLERS.messages.message(
      // send message
      coinUser.route, // route
      coinUser.number, // number
      coinUser.language, // language
      'earnings', // type
      [
        coinUser.username ? coinUser.username : coinUser.number, // username
        lifetime.staking > 0 // lifetime staking
          ? (oneWeek.staking > 0 // one week staking
              ? '\n' +
                CONTROLLERS.prices.formatCrypto(
                  // format crypto
                  'divi', // coin
                  parseInt(oneWeek.staking), // staking
                  coinUser.cur // cur
                ) +
                ' staking' + // staking
                (oneWeek.lottery > 0 // one week lottery
                  ? ' and ' +
                    CONTROLLERS.prices.formatCrypto(
                      // format crypto
                      'divi', // coin
                      parseInt(oneWeek.lottery), // lottery
                      coinUser.cur // cur
                    ) +
                    ' in lotteries' // lottery
                  : '') +
                (oneWeek.rors > 0 // one week rors
                  ? ' with an average ROR of ' + // with an average ROR of
                    parseInt(oneWeek.ror / oneWeek.rors) + // ror
                    '%'
                  : '') +
                ' in the last week' // last week
              : '') +
            (oneMonth.staking > 0 && oneWeek.staking != oneMonth.staking // one month staking
              ? '\n' +
                CONTROLLERS.prices.formatCrypto(
                  // format crypto
                  'divi', // coin
                  parseInt(oneMonth.staking), // staking
                  coinUser.cur // cur
                ) +
                ' staking' + // staking
                (oneMonth.lottery > 0 // one month lottery
                  ? ' and ' +
                    CONTROLLERS.prices.formatCrypto(
                      // format crypto
                      'divi', // coin
                      parseInt(oneMonth.lottery), // lottery
                      coinUser.cur // cur
                    ) +
                    ' in lotteries' // lottery
                  : '') +
                (oneMonth.rors // one month rors
                  ? ' with an average ROR of ' + // with an average ROR of
                    parseInt(oneMonth.ror / oneMonth.rors) + // ror
                    '%'
                  : '') +
                ' in the last month' // last month
              : '') +
            (threeMonth.staking > 0 && threeMonth.staking != oneMonth.staking // three month staking
              ? '\n' +
                CONTROLLERS.prices.formatCrypto(
                  // format crypto
                  'divi', // coin
                  parseInt(threeMonth.staking), // staking
                  coinUser.cur // cur
                ) +
                ' staking' + // staking
                (threeMonth.lottery > 0 // three month lottery
                  ? ' and ' +
                    CONTROLLERS.prices.formatCrypto(
                      // format crypto
                      'divi', // coin
                      parseInt(threeMonth.lottery), // lottery
                      coinUser.cur // cur
                    ) +
                    ' in lotteries' // lottery
                  : '') +
                (threeMonth.rors // three month rors
                  ? ' with an average ROR of ' + // with an average ROR of
                    parseInt(threeMonth.ror / threeMonth.rors) + // ror
                    '%'
                  : '') +
                ' in the three months' // three months
              : '') +
            (oneYear.staking > 0 && threeMonth.staking != oneYear.staking // one year staking
              ? '\n' +
                CONTROLLERS.prices.formatCrypto(
                  // format crypto
                  'divi', // coin
                  parseInt(oneYear.staking), // staking
                  coinUser.cur // cur
                ) +
                ' staking' + // staking
                (oneYear.lottery > 0 // one year lottery
                  ? ' and ' +
                    CONTROLLERS.prices.formatCrypto(
                      // format crypto
                      'divi', // coin
                      parseInt(oneYear.lottery), // lottery
                      coinUser.cur // cur
                    ) +
                    ' in lotteries' // lottery
                  : '') +
                (oneYear.rors // one year rors
                  ? ' with an average ROR of ' + // with an average ROR of
                    parseInt(oneYear.ror / oneYear.rors) + // ror
                    '%'
                  : '') +
                ' in the last year' // last year
              : '') +
            (lifetime.staking > 0 && lifetime.staking != oneYear.staking // lifetime staking
              ? '\n' +
                CONTROLLERS.prices.formatCrypto(
                  // format crypto
                  'divi', // coin
                  parseInt(lifetime.staking), // staking
                  coinUser.cur // cur
                ) +
                ' staking' + // staking
                (lifetime.lottery > 0 // lifetime lottery
                  ? ' and ' +
                    CONTROLLERS.prices.formatCrypto(
                      // format crypto
                      'divi', // coin
                      parseInt(lifetime.lottery), // lottery
                      coinUser.cur // cur
                    ) +
                    ' in lotteries' // lottery
                  : '') +
                (lifetime.rors // lifetime rors
                  ? ' with an average ROR of ' + // with an average ROR of
                    parseInt(lifetime.ror / lifetime.rors) + // ror
                    '%'
                  : '') +
                ' in all your time with CasperGo' // all your time with CasperGo
              : '')
          : "You haven't had any earnings yet, you can start by adding DIVI to your account!", // no staking
      ]
    )
  } else {
    // no earnings
    await CONTROLLERS.messages.message(
      // send message
      coinUser.route, // route
      coinUser.number, // number
      coinUser.language, // language
      'noEarningAccount', // type
      []
    )
  }
}
