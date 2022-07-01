require('dotenv').config()
const APP = require('gnodejs')
const MGO = require('gmongo')
const bip32 = require('bip32')
const bitcoinjs = require('bitcoinjs-lib')

const DIVI_RPC = require('./divi-rpc')

const network = require('../networks')[process.env.DIVI_NETWORK_TYPE].divi

const getHashFromAddress = address =>
  bitcoinjs.address.fromBase58Check(address).hash.toString('hex')

const divi = {
  getTxsInList: async (transactions, block) => {
    let addresses = {}
    if (transactions && transactions.length > 0) {
      for (let i = 0; i < transactions.length; i++) {
        const tx = await divi.get.tx(transactions[i])
        if (tx && tx.vin && tx.vin.length > 0) {
          for (let n = 0; n < tx.vin.length; n++) {
            if (!tx.vin[n].coinbase && tx.vin[n].txid) {
              let thisTx = null
              const incomingTx = await divi.get.tx(tx.vin[n].txid)
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
                console.log('divi 46 value > 0', thisTx)
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
              console.log('divi 75 value > 0', tx.vout[n])
            }
          }
        }
      }
    }
    return addresses
  },
  block: {
    count: _ => DIVI_RPC.getBlockCount(),
    hash: block => DIVI_RPC.getBlockHash(block),
    get: hash => DIVI_RPC.getBlock(hash),
    getTxs: async block =>
      await divi.getTxsInList(
        (await divi.block.get(await divi.block.hash(block))).tx,
        block
      )
  },
  mempool: {
    get: _ => DIVI_RPC.getRawMemPool(),
    getTxs: async _ => {
      const txList = await divi.mempool.get()
      const txs = []
      for (let i = 0; i < txList.length; i++) {
        if (!divi.txList[txList[i]]) {
          txs.push(txList[i])
        }
      }
      return await divi.getTxsInList(txs, -1)
    }
  },
  balance: async _ => {
    const balance = await DIVI_RPC.getBalance()
    const unconfirmed = await DIVI_RPC.getUnconfirmedBalance()
    return { balance, unconfirmed, total: balance + unconfirmed }
  },
  forkCheck: async (block, hash) =>
    (await DIVI_RPC.getBlockHash(block)) != hash,
  stakingStatus: async _ =>
    (await DIVI_RPC.getStakingStatus())['staking status'],
  get: {
    address: {
      new: _ => DIVI_RPC.getNewAddress(),
      balance: list =>
        DIVI_RPC.getAddressBalance({
          addresses: Array.isArray(list) ? list : [list]
        }),
      delats: list =>
        DIVI_RPC.getAddressDeltas({
          addresses: Array.isArray(list) ? list : [list]
        }),
      memPool: list =>
        DIVI_RPC.getAddressMempool({
          addresses: Array.isArray(list) ? list : [list]
        }),
      txs: list =>
        DIVI_RPC.getAddressTxIds({
          addresses: Array.isArray(list) ? list : [list]
        }),
      utxos: list =>
        DIVI_RPC.getAddressUtxos({
          addresses: Array.isArray(list) ? list : [list]
        })
    },
    lotteryBlockWinners: block => DIVI_RPC.getLotteryBlockWinners(block),
    rawTx: txid => DIVI_RPC.getRawTransaction(txid),
    fromRaw: tx => DIVI_RPC.decodeRawTransaction(tx),
    tx: async txid => {
      if (!divi.txList[txid]) {
        divi.txList[txid] = await divi.get.fromRaw(await divi.get.rawTx(txid))
      }
      return divi.txList[txid]
    }
  },
  txList: {},
  mnsync: {
    status: _ => DIVI_RPC.mnSync('status'),
    reset: _ => DIVI_RPC.mnSync('reset')
  },
  import: {
    address: (address, label, reScan) =>
      DIVI_RPC.importAddress(address, label, reScan),
    key: (key, label, reScan) => DIVI_RPC.importPrivKey(key, label, reScan)
  },
  sendTx: transactionHex => DIVI_RPC.sendRawTransaction(transactionHex),
  updateLastBlock: newBlock =>
    APP.files.write(__dirname + '/divi.lastBlock', newBlock.toString()),
  getLastBlock: _ =>
    APP.files.exists(__dirname + '/divi.lastBlock')
      ? parseInt(APP.files.read(__dirname + '/divi.lastBlock'))
      : 0
}

const cron = {
  updateAddress: async _ => {},
  add: addressUpdate => {
    cron.updateAddress = addressUpdate
    cron.mem.start = new Date().getTime()
    cron.mem.lastBlock = divi.getLastBlock()
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
        let Addresses = await divi.mempool.getTxs()
        for (let x in Addresses) {
          if (cron.mem.addresses[x]) {
            cron.updateAddress(-1, x, Addresses[x])
          }
        }
        if (Object.keys(divi.txList).length > parseInt(process.env.DIVI_MAX_TX)) {
          divi.txList = {}
        }
        cron.mem.isTenRunning = false
      }
    }
  },
  minute: {
    five: async _ => {
      const isStaking = await divi.stakingStatus()
      if (isStaking != cron.mem.isStaking) {
        cron.mem.isStaking = isStaking
        console.log(
          cron.mem.isStaking ? 'Is now Staking' : 'IS NOT STAKING ... ALERT'
        )
      }
      const thisBalance = await divi.balance()
      if (thisBalance.total != cron.mem.lastTotalBalance) {
        cron.mem.lastTotalBalance = thisBalance.total
        console.log('New Balance:', cron.mem.lastTotalBalance)
      }
    }
  },
  indexAddresses: async _ => {
    const thisBlock = await divi.block.count()
    if (thisBlock) {
      if (!cron.mem.lastBlock) {
        cron.mem.lastBlock = thisBlock - 1
      }
      while (cron.mem.lastBlock < thisBlock) {
        cron.mem.lastBlock++
        console.log(cron.mem.lastBlock)
        let Addresses = await divi.block.getTxs(cron.mem.lastBlock)
        for (let x in Addresses) {
          //console.log('check', x)
          if (cron.mem.addresses[x]) {
            await cron.updateAddress(cron.mem.lastBlock, x, Addresses[x])
          }
        }
        divi.updateLastBlock(cron.mem.lastBlock)
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