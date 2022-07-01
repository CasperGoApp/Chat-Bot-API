require('dotenv').config()
const APP = require('gnodejs')
const MGO = require('gmongo')
const bip32 = require('bip32')
const bitcoinjs = require('bitcoinjs-lib')

const BTC_RPC = require('./btc-rpc')

const network = require('../networks')[process.env.BTC_NETWORK_TYPE].btc

const getHashFromAddress = address =>
  bitcoinjs.address.fromBase58Check(address).hash.toString('hex')

const btc = {
  getTxsInList: async (transactions, block) => {
    let addresses = {}
    if (transactions && transactions.length > 0) {
      for (let i = 0; i < transactions.length; i++) {
        const tx = await btc.get.tx(transactions[i])
        if (tx && tx.vin && tx.vin.length > 0) {
          for (let n = 0; n < tx.vin.length; n++) {
            if (!tx.vin[n].coinbase && tx.vin[n].txid) {
              let thisTx = null
              const incomingTx = await btc.get.tx(tx.vin[n].txid)
              for (let m = 0; !thisTx && m < incomingTx.vout.length; m++) {
                if (incomingTx.vout[m].n == tx.vin[n].vout) {
                  thisTx = incomingTx.vout[m]
                }
              }
              if (
                thisTx &&
                thisTx.scriptPubKey &&
                thisTx.scriptPubKey.addresses &&
                thisTx.scriptPubKey.addresses.length > 0
              ) {
                for (let m = 0; m < thisTx.scriptPubKey.addresses.length; m++) {
                  if (!addresses[thisTx.scriptPubKey.addresses[m]]) {
                    addresses[thisTx.scriptPubKey.addresses[m]] = []
                  }
                  addresses[thisTx.scriptPubKey.addresses[m]].push({
                    out: true,
                    block,
                    amount: thisTx.value,
                    tx: tx.vin[n],
                    txid: tx.vin[n].txid
                  })
                }
              } else if (thisTx && thisTx.value && thisTx.value > 0) {
                console.log('btc 50 value > 0', thisTx)
              }
            }
          }
        }
        if (tx && tx.vout && tx.vout.length > 0) {
          for (let n = 0; n < tx.vout.length; n++) {
            if (
              tx.vout[n] &&
              tx.vout[n].scriptPubKey &&
              tx.vout[n].scriptPubKey.addresses &&
              tx.vout[n].scriptPubKey.addresses.length > 0
            ) {
              for (
                let m = 0;
                m < tx.vout[n].scriptPubKey.addresses.length;
                m++
              ) {
                if (!addresses[tx.vout[n].scriptPubKey.addresses[m]]) {
                  addresses[tx.vout[n].scriptPubKey.addresses[m]] = []
                }
                addresses[tx.vout[n].scriptPubKey.addresses[m]].push({
                  out: false,
                  block,
                  amount: tx.vout[n].value,
                  vout: tx.vout[n].n,
                  txid: tx.txid
                })
              }
            } else if (tx.vout[n].value > 0) {
              console.log('btc 79 value > 0', tx.vout[n])
            }
          }
        }
      }
    }
    return addresses
  },
  block: {
    count: _ => BTC_RPC.getBlockCount(),
    hash: block => BTC_RPC.getBlockHash(block),
    get: hash => BTC_RPC.getBlock(hash),
    getTxs: async block =>
      await btc.getTxsInList(
        (await btc.block.get(await btc.block.hash(block))).tx,
        block
      )
  },
  mempool: {
    get: _ => BTC_RPC.getRawMemPool(),
    getTxs: async _ => {
      const txList = await btc.mempool.get()
      const txs = []
      for (let i = 0; i < txList.length; i++) {
        if (!btc.txList[txList[i]]) {
          txs.push(txList[i])
        }
      }
      return await btc.getTxsInList(txs, -1)
    }
  },
  balance: async _ => {
    const balance = await BTC_RPC.getBalance()
    return { balance, total: balance }
  },
  get: {
    rawTx: txid => BTC_RPC.getRawTransaction(txid),
    fromRaw: tx => BTC_RPC.decodeRawTransaction(tx),
    tx: async txid => {
      if (!btc.txList[txid]) {
        btc.txList[txid] = await btc.get.fromRaw(await btc.get.rawTx(txid))
      }
      return btc.txList[txid]
    }
  },
  txList: {},
  mnsync: {
    status: _ => BTC_RPC.mnSync('status'),
    reset: _ => BTC_RPC.mnSync('reset')
  },
  import: {
    address: (address, label, reScan) =>
      BTC_RPC.importAddress(address, label, reScan),
    key: (key, label, reScan) => BTC_RPC.importPrivKey(key, label, reScan)
  },
  sendTx: transactionHex => BTC_RPC.sendRawTransaction(transactionHex),
  updateLastBlock: newBlock =>
    APP.files.write(__dirname + '/btc.lastBlock', newBlock.toString()),
  getLastBlock: _ =>
    APP.files.exists(__dirname + '/btc.lastBlock')
      ? parseInt(APP.files.read(__dirname + '/btc.lastBlock'))
      : 0
}

const cron = {
  updateAddress: async _ => {},
  add: addressUpdate => {
    cron.updateAddress = addressUpdate
    cron.mem.start = new Date().getTime()
    cron.mem.lastBlock = btc.getLastBlock()
    setInterval(cron.second.ten, 10 * 1000)
    setInterval(cron.minute.five, 5 * 60 * 1000)
  },
  mem: {
    lastTotalBalance: null,
    isStaking: null,
    start: null,
    lastBlock: null,
    isTenRunning: false,
    addresses: {},
    addressListFile: null,
    addressListUpdateTriggerFile: null
  },
  second: {
    ten: async _ => {
      if (!cron.mem.isTenRunning) {
        cron.mem.isTenRunning = true
        if (
          cron.mem.addressListUpdateTriggerFile &&
          APP.files.exists(cron.mem.addressListUpdateTriggerFile)
        ) {
          APP.files.delete(cron.mem.addressListUpdateTriggerFile)
          cron.checkAddressList()
        }
        await cron.indexAddresses()
        let Addresses = await btc.mempool.getTxs()
        for (let x in Addresses) {
          if (cron.mem.addresses[x]) {
            cron.updateAddress(-1, x, Addresses[x])
          }
        }
        if (Object.keys(btc.txList).length > parseInt(process.env.BTC_MAX_TX)) {
          btc.txList = {}
        }
        cron.mem.isTenRunning = false
      }
    }
  },
  minute: {
    five: async _ => {
      const thisBalance = await btc.balance()
      if (thisBalance.total != cron.mem.lastTotalBalance) {
        cron.mem.lastTotalBalance = thisBalance.total
        console.log('New Balance:', cron.mem.lastTotalBalance)
      }
    }
  },
  indexAddresses: async _ => {
    const thisBlock = await btc.block.count()
    if (thisBlock) {
      if (!cron.mem.lastBlock) {
        cron.mem.lastBlock = thisBlock - 1
      }
      while (cron.mem.lastBlock < thisBlock) {
        cron.mem.lastBlock++
        //console.log(cron.mem.lastBlock)
        let Addresses = await btc.block.getTxs(cron.mem.lastBlock)
        for (let x in Addresses) {
          //console.log('check', x)
          if (cron.mem.addresses[x]) {
            await cron.updateAddress(cron.mem.lastBlock, x, Addresses[x])
          }
        }
        btc.updateLastBlock(cron.mem.lastBlock)
      }
    }
  },
  checkAddressList: _ => {
    if (cron.mem.addressListFile && cron.mem.addressListFile.length > 0) {
      const addressList = APP.files.read(cron.mem.addressListFile)
      if (addressList && addressList.length > 0) {
        module.exports.updateAddressList(APP.parse(addressList))
      }
    }
  }
}

module.exports = {
  start: async (addressList, addressUpdateTrigger, addressUpdate) => {
    if (addressUpdateTrigger) {
      cron.mem.addressListUpdateTriggerFile = addressUpdateTrigger
    }
    if (addressList && APP.files.exists(addressList)) {
      cron.mem.addressListFile = addressList
      cron.checkAddressList()
    }
    console.log(await BTC_RPC.loadWallet('testwallet'))
    cron.add(addressUpdate)
  },
  updateAddressList: addressList => {
    const addressesList = {}
    for (let i = 0; i < addressList.length; i++) {
      addressesList[addressList[i]] = true
    }
    cron.mem.addresses = addressesList
  }
}
