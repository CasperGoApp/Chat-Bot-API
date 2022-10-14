let id = 0 // initialize id

const getFetchOptions = (id, method, params) => ({
  // getFetchOptions is a function which populates standard fetch options
  method: 'post', // set method to POST
  headers: {
    'Content-Type': 'application/json',
  }, // set content type
  body: JSON.stringify({ id, jsonrpc: '2.0', method, params }), // prepare data to send
})

const getRPCData = async (method, params) =>
  (await fetch(RPC.url, getFetchOptions(++id, method, params))).json() //retrieve RPC data from server

const RPC = {
  url: 'https://caspergo.io/rpcTestnet', // default server from Active peer list
  putDeploy: async (deploy) =>
    (await getRPCData('account_put_deploy', { deploy })).result.deploy_hash, // putDeploy is a function which sends deploy data to server and returns deploy hash
  getDeployInfo: async (deploy_hash) =>
    (await getRPCData('info_get_deploy', { deploy_hash })).result.deploy, // getDeployInfo is a function which sends deploy hash to server and returns deploy info
  getBlockInfo: async (Hash) =>
    (await getRPCData('chain_get_block', { block_identifier: { Hash } })).result
      .block, // getBlockInfo is a function which sends block hash to server and returns block info
  getBlockInfoByHeight: async (Height) =>
    (await getRPCData('chain_get_block', { block_identifier: { Height } }))
      .result.block, // getBlockInfoByHeight is a function which sends block height to server and returns block info
  getLatestBlock: async (_) =>
    (await getRPCData('chain_get_block')).result.block, // getLatestBlock is a function which returns latest block info
  getPeers: async (_) => (await getRPCData('info_get_peers')).result.peers, // getPeers is a function which returns peer list
  getStatus: async (_) => (await getRPCData('info_get_status')).result, // getStatus is a function which returns status
  getAuctionInfo: async (_) =>
    (await getRPCData('state_get_auction_info')).result.auction_state, // getAuctionInfo is a function which returns auction info (stakers)
  getStateRootHash: async (block_hash) =>
    (await getRPCData('chain_get_state_root_hash', { block_hash })).result
      .state_root_hash, // getStateRootHash is a function which returns state root hash
  getStateItem: async (state_root_hash, key, path) => {
    // getStateItem is a function which returns state item
    try {
      const data = await getRPCData('state_get_item', {
        state_root_hash,
        key,
        path,
      }) // get state item
      return data.result.stored_value // return stored value
    } catch (e) {
      console.log(e) // log error
    }
  },
  getAccountBalance: async (state_root_hash, purse_uref) =>
    (await getRPCData('state_get_balance', { state_root_hash, purse_uref }))
      .result.balance_value, // getAccountBalance is a function which returns account balance
  getBlockTransfers: async (Hash) =>
    (
      await getRPCData('chain_get_block_transfers', {
        block_identifier: { Hash },
      })
    ).result.transfers, // getBlockTransfers is a function which returns block transfers
  getAccountInfo: async (Hash, public_key) => {
    // getAccountInfo is a function which returns account info
    const data = await getRPCData('state_get_account_info', {
      block_identifier: { Hash },
      public_key,
    }) // get account info
    return data && data.result && data.result.account
      ? data.result.account
      : null // return account info
  },
  getDictItem: async (state_root_hash, seed_uref, dictionary_item_key) =>
    (
      await getRPCData('state_get_dictionary_item', {
        state_root_hash,
        dictionary_identifier: { URef: { seed_uref, dictionary_item_key } },
      })
    ).result.stored_value, // getDictItem is a function which returns dictionary item
}
