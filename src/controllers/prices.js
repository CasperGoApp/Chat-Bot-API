const APP = require('gnodejs') // import app gnodejs

const cFiats = {
  // fiats
  usd: { symbol: '$', decimal: 2 }, // usd
  eur: { symbol: '€', decimal: 2 }, // eur
  mxn: { symbol: '$', decimal: 2 }, // mxn
  jpy: { symbol: '¥', decimal: 0 }, // jpy
  krw: { symbol: '₩', decimal: 0 }, // krw
  czk: { symbol: 'Kč', decimal: 0 }, // czk
  cny: { symbol: '¥', decimal: 0 }, // cny
}

const coinList = {
  // coins
  divi: { code: 'divi', decimal: 3 }, // divi
  btc: { code: 'btc', decimal: 0 }, // btc
}

let CONTROLLERS = null // controllers

const prices = {
  // prices
  prices: {}, // prices
  load: (oCONTROLLERS) => {
    // load
    CONTROLLERS = oCONTROLLERS // controllers
    prices.getPrices() // get prices
    setInterval(prices.getPrices, 60 * 1000) // get prices every minute
  },
  getPrices: async (_) => {
    // get prices
    try {
      // try
      const newPrices = await // new prices
      (
        await APP.http(true, 'gnome.one', 'get', 443, {}, '/priceUSD', {})
      ) // get price usd
        .json() // json
      if (
        // if
        newPrices && // new prices
        newPrices.btc && // btc
        JSON.stringify(newPrices) != JSON.stringify(prices.prices) // not equal
      ) {
        newPrices.added = new Date() // added
        prices.prices = newPrices // prices
        await CONTROLLERS.mgo.insert(CONTROLLERS.db, 'priceLogs', newPrices) // insert price logs
      }
    } catch (e) {} // catch
  },
  fiatToCrypto: (coin, amount, fiat) => {
    // fiat to crypto
    return parseFloat(
      // return
      // parse float
      (
        (prices.prices.fiat[fiat.toLowerCase()]
          ? prices.prices.fiat[fiat.toLowerCase()]
          : 1) * // fiat
        (prices.prices[coin.toLowerCase()] // price
          ? 1 / prices.prices[coin.toLowerCase()] // 1 / prices.prices[coin.toLowerCase()]
          : 0) * // 1 / prices
        amount
      ) // amount
        .toFixed(8) // to fixed
    )
  },
  formatAmount: (coin, fiat) => {
    // format amount
    const baseAmout = prices.prices[coin.toLowerCase()] // base amount
      ? prices.prices[coin.toLowerCase()] // prices
      : 0 // 0
    const fiatTotal = // fiat total
      prices.prices && // prices
      prices.prices.fiat &&
      prices.prices.fiat[fiat.toLowerCase()]
        ? prices.prices.fiat[fiat.toLowerCase()] // fiat
        : 0 // 0
    const fiatAmount = baseAmout * fiatTotal // fiat amount
    return (
      // return
      cFiats[fiat.toLowerCase()].symbol + // symbol
      APP.addCommas(
        // add commas
        fiatAmount.toFixed(
          // to fixed
          coinList[coin.toLowerCase()] // coin list
            ? coinList[coin.toLowerCase()].decimal // coin list
            : cFiats[fiat.toLowerCase()].decimal // cFiats
        ) // to fixed
      )
    )
  },
  formatCrypto: (coin, amount, fiat) => {
    // format crypto
    amount = amount ? amount : 0 // amount
    let fiatAmount = 0 // fiat amount
    if (fiat.toLowerCase() == 'usd') {
      // if
      if (prices.prices[coin.toLowerCase()]) {
        // if
        fiatAmount = prices.prices[coin.toLowerCase()] * amount // fiat amount
      }
    } else if (
      // if
      prices.prices.fiat[fiat.toLowerCase()] && // fiat
      prices.prices[coin.toLowerCase()] // prices
    ) {
      fiatAmount = // fiat amount
        prices.prices[coin.toLowerCase()] * // prices
        prices.prices.fiat[fiat.toLowerCase()] * // fiat
        amount // amount
    }
    const fixedAmount = fiatAmount.toFixed(cFiats[fiat.toLowerCase()].decimal) // fixed amount
    return amount // return
      ? parseFloat(amount.toFixed(8)).toString() + // amount
          ' ' + // space
          coin.toUpperCase() + // coin
          (fiatAmount > 0 && fixedAmount // if
            ? ' (' +
              cFiats[fiat.toLowerCase()].symbol + // symbol
              APP.addCommas(fixedAmount) + // add commas
              ')'
            : '') // empty
      : '0' // 0
  },
  convertCrypto: (coin, amount, fiat) => {
    // convert crypto
    amount = amount ? amount : 0 // amount
    let fiatAmount = 0 // fiat amount
    if (fiat.toLowerCase() == 'usd') {
      // if
      if (prices.prices[coin.toLowerCase()]) {
        // if
        fiatAmount = prices.prices[coin.toLowerCase()] * amount // fiat amount
      }
    } else if (
      // if
      prices.prices.fiat[fiat.toLowerCase()] && // fiat
      prices.prices[coin.toLowerCase()] // prices
    ) {
      fiatAmount = // fiat amount
        prices.prices[coin.toLowerCase()] * // prices
        prices.prices.fiat[fiat.toLowerCase()] * // fiat
        amount // amount
    }
    const fixedAmount = fiatAmount.toFixed(cFiats[fiat.toLowerCase()].decimal) // fixed amount
    return parseFloat(fixedAmount) // return
  },
  getCurrencyPriceList: (cur) => {
    // get currency price list
    let list = [] // list
    for (let x in coinList) {
      // for
      const showCurrency = x // show currency
        .toUpperCase() // upper
        .padEnd(5, ' ') // pad end
      list.push(
        // push
        showCurrency + // show currency
          ' -> ' + // ->
          cur.toUpperCase() + // cur
          ' ' + // space
          prices // prices
            .formatAmount(coinList[x].code.toLowerCase(), cur) // format amount
            .padStart(8, ' ') // pad start
      )
    }
    return list // return
  },
}

module.exports = prices // export
