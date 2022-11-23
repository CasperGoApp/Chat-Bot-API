const BlockMonitor = {
  // BlockMonitor is a class which contains methods to monitor blocks
  lastBlock: 0, // lastBlock contains last block height
  delay: 15000, // delay is a delay between block checking
  lastBlockId: 0, // lastBlockId is a last block height in memory
  accounts: null, // accounts is a list of accounts to check in blocks
  running: false, // running is a flag which indicates if BlockMonitor is running
  onFoundTx: null, // onFoundTx is a callback function which is called when transaction is found
  load: async (foundTx) => {
    // load is a function which starts the block monitor
    BlockMonitor.lastBlock = parseInt(
      localStorage.getItem('lastBlock')
        ? localStorage.getItem('lastBlock')
        : (await RPC.getLatestBlock()).header.height
    ) // set last block height
    BlockMonitor.onFoundTx = foundTx // set callback function
    BlockMonitor.lastBlockId = parseInt(BlockMonitor.lastBlock) // load last block height from file
    BlockMonitor.check() // check blocks
    setInterval(BlockMonitor.check, BlockMonitor.delay) // start checking blocks in an interval
  },
  setBlock: (_) => {
    BlockMonitor.lastBlock = BlockMonitor.lastBlockId.toString()
    localStorage.setItem('lastBlock', BlockMonitor.lastBlock)
    $('#BlockNumber').html('Block: ' + addCommas(BlockMonitor.lastBlock))
  }, // setBlock is a function which sets last block height to file
  check: async (_) => {
    // check is a function which checks block height and returns transactions in the block
    //if (BlockMonitor.running) {
      // if block monitor is running
      //return // return
    //}
    BlockMonitor.running = true // set running flag to true
    const thisBlockId = (await RPC.getLatestBlock()).header.height // get latest block height
    while (BlockMonitor.lastBlockId < thisBlockId) {
      // while last block height is less than this block height
      const transfers = await RPC.getBlockTransfers(
        (
          await RPC.getBlockInfoByHeight(BlockMonitor.lastBlockId)
        ).hash
      ) // get transfers in the block
      let txCount = 0
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
        txCount++
      }
      $('#BlockTransactions').html('Transfer Count: ' + txCount)
      BlockMonitor.lastBlockId++ // increment last block height
      BlockMonitor.setBlock() // set last block height to file
    }
    BlockMonitor.running = false // set running flag to false
  },
}
