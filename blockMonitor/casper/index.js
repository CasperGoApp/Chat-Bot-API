const fs = require('fs') // fs is a node module
const fetch = require('node-fetch') // fetch is a node module
const RPC = require('./rpc') // RPC is a module which returns RPC object

const BlockMonitor = {
  // BlockMonitor is a class which contains methods to monitor blocks
  lastBlockFile: __dirname + '/.lastBlock', // lastBlockFile is a path to file which contains last block height
  addressesFile: __dirname + '/.addressList', // addressesFile is a path to file which contains addresses
  addressUpdateFile: __dirname + '/updateAddressList', // addressUpdateFile is a path to file which indicates if addresses were updated and need to be reloaded
  delay: 15000, // delay is a delay between block checking
  lastBlockId: 0, // lastBlockId is a last block height in memory
  accounts: null, // accounts is a list of accounts to check in blocks
  running: false, // running is a flag which indicates if BlockMonitor is running
  onFoundTx: null, // onFoundTx is a callback function which is called when transaction is found
  load: (foundTx) => {
    // load is a function which starts the block monitor
    BlockMonitor.onFoundTx = foundTx // set callback function
    BlockMonitor.lastBlockId = parseInt(
      fs.readFileSync(BlockMonitor.lastBlockFile)
    ) // load last block height from file
    BlockMonitor.checkLoadAccounts() // check if accounts need to be loaded
    BlockMonitor.check() // check blocks
    setInterval(BlockMonitor.check, BlockMonitor.delay) // start checking blocks in an interval
  },
  setBlock: (_) =>
    fs.writeFileSync(
      BlockMonitor.lastBlockFile,
      BlockMonitor.lastBlockId.toString()
    ), // setBlock is a function which sets last block height to file
  checkLoadAccounts: (_) => {
    // checkLoadAccounts is a function which checks if accounts need to be loaded
    const loadAccounts = !BlockMonitor.accounts // loadAccounts is a flag which indicates if accounts need to be loaded
    if (fs.existsSync(BlockMonitor.addressUpdateFile)) {
      // check if address update file exists
      fs.unlinkSync(BlockMonitor.addressUpdateFile) // delete address update file
      loadAccounts = true // set loadAccounts flag to true
    }
    if (loadAccounts) {
      // do accounts need to be loaded
      BlockMonitor.accounts = JSON.parse(
        fs.readFileSync(BlockMonitor.addressesFile)
      ) // load accounts from file
    }
  },
  check: async (_) => {
    // check is a function which checks block height and returns transactions in the block
    if (BlockMonitor.running) {
      // if block monitor is running
      return // return
    }
    BlockMonitor.running = true // set running flag to true
    const thisBlockId = (await RPC.getLatestBlock()).header.height // get latest block height
    while (BlockMonitor.lastBlockId < thisBlockId) {
      // while last block height is less than this block height
      BlockMonitor.checkLoadAccounts() // check if accounts need to be loaded
      const transfers = await RPC.getBlockTransfers(
        (
          await RPC.getBlockInfoByHeight(BlockMonitor.lastBlockId)
        ).hash
      ) // get transfers in the block
      for (let value of transfers) {
        // for each transfer
        if (
          (BlockMonitor.accounts[value.from] ||
            BlockMonitor.accounts[value.to]) &&
          BlockMonitor.onFoundTx
        ) {
          // if transfer is from or to an account
          BlockMonitor.onFoundTx(BlockMonitor.lastBlockId, value) // call callback function
        }
      }
      BlockMonitor.lastBlockId++ // increment last block height
      BlockMonitor.setBlock() // set last block height to file
    }
    BlockMonitor.running = false // set running flag to false
  },
}

const callback = (blockId, transaction) => {
  // callback is a function which is called when transaction is found
  console.log('Found transaction in block ' + blockId, transaction) // log transaction
  const result = fetch('http://127.0.0.1/gotTx', {
    method: 'post', // set method to POST
    headers: { 'Content-Type': 'application/json' }, // set content type
    body: JSON.stringify({ blockId, transaction }), // set body
  })
}

BlockMonitor.load(callback) // load block monitor

module.exports = BlockMonitor // export BlockMonitor
