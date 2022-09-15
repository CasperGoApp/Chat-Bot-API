const { KeyFactory, EncryptionType, CasperHDWallet } = require('casper-storage') // import casper-storage
const casperClientSDK = require('casper-js-sdk') // import casper-js-sdk
const { Keys, CasperClient, CLPublicKey, DeployUtil } = require('casper-js-sdk') // import casper-js-sdk functions
const RPC = require('../../../blockMonitor/casper/rpc') //import the RPC object

const keyManager = KeyFactory.getInstance() // get the key manager

const hex = (x) => Buffer.from(x).toString('hex') // convert to hex

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) // sleep function

const DELAY_FOR_INITIAL_PAYMENT = 60 * 2 * 1000 // 2 minutes
const NEW_ACCOUNT_AMOUNT = 2.5 * 1000000000 // 2.5 minimum amount to send to a new account
const PAYMENT_AMOUNT = 100000000 // 100000000 nano for a transfer fee
const GAS_PRICE = 1 // gas price for transfer
const SEND_TTL = 1800000 // 30 minutes

const getStateHash = async (_) =>
  RPC.getStateRootHash((await RPC.getLatestBlock()).hash) // get the state hash

const getAccount = async (accountSeed, index, includePrivateKey, isRetry) => {
  // get the account
  let account = isRetry ? isRetry : null // if the account is retry, set it to the account
  if (!account) {
    // if the account is not retry, get the account from the seed
    const hdWallet = new CasperHDWallet(
      accountSeed ? accountSeed : seed,
      EncryptionType.Ed25519
    ) // create the hd wallet
    const userAccount = await hdWallet.getAccount(index) // get the account
    account = {
      public: {
        key: await userAccount.getPublicKey(), // get the public key
        address: await userAccount.getPublicAddress(), // get the public address
        //hash: await userAccount.getPublicHash(), // get the public hash
      },
    }
  }
  let publicAccount = null // set the public account to null
  try {
    publicAccount = await RPC.getAccountInfo(
      (
        await RPC.getLatestBlock()
      ).hash,
      account.public.address
    ) // get the public account from the blockchain
    if (publicAccount) {
      // if the public account exists
      account.hashString = publicAccount.account_hash // set the hash string
      account.uref = publicAccount.main_purse // set the uref
      account.balance =
        (await RPC.getAccountBalance(await getStateHash(), account.uref)) /
        1000000000 // set the balance
    } else if (!isRetry && sourceAccount) {
      // if the public account does not exist and the account is not retry
      await sendTransfer(
        new Date().getTime(),
        'casper' + (TESTNET ? '-test' : ''),
        sourceAccount,
        account.public.address,
        NEW_ACCOUNT_AMOUNT
      ) // send the new account the min amount to index in the blockchain
      await sleep(DELAY_FOR_INITIAL_PAYMENT) // sleep for the initial payment
      return getAccount(accountSeed, index, includePrivateKey, account) // get the account again - RECURSIVE
    }
  } catch (e) {
    console.log(e.message) // log the error
  }
  if (includePrivateKey && (!account.privateKey || isRetry)) {
    // if the private key is included and the private key is not set or the account is retry
    const hdWallet = new CasperHDWallet(
      accountSeed ? accountSeed : seed,
      EncryptionType.Ed25519
    ) // create the hd wallet
    const userAccount = await hdWallet.getAccount(index) // get the account
    account.privateKey = userAccount.getPrivateKey() // set the private key
  }
  return account // return the account
}

const sendTransfer = async (id, networkName, fromAccount, to, amount) => {
  // send a transfer
  const casperClient = new CasperClient(RPC.url) // create the casper client
  const signKeyPair = Keys.Ed25519.parseKeyPair(
    Buffer.from(fromAccount.public.key, 'hex'),
    Buffer.from(fromAccount.privateKey, 'hex')
  ) // create the sign key pair
  const deployParams = new DeployUtil.DeployParams(
    signKeyPair.publicKey,
    networkName,
    GAS_PRICE,
    SEND_TTL
  ) // create the deploy params
  const toPublicKey = CLPublicKey.fromHex(to) // create the to public key
  const session = DeployUtil.ExecutableDeployItem.newTransfer(
    amount,
    toPublicKey,
    null,
    id
  ) // create the session
  const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT) // create the payment
  const deploy = DeployUtil.makeDeploy(deployParams, session, payment) // create the deploy
  const signedDeploy = DeployUtil.signDeploy(deploy, signKeyPair) // sign the deploy
  return await casperClient.putDeploy(signedDeploy) // send the deploy
}

let TESTNET = true // set the testnet to true
let URL = null // set the url to null
let sourceAccount = null // set the source account to null
let seed = null // set the seed to null

module.exports = {
  // export the functions
  start: async (url, isTest, userSeed) => {
    // start the casper
    URL = url // set the url
    RPC.url = url // set the rpc url
    TESTNET = isTest // set the testnet
    seed = userSeed // set the seed
    //sourceAccount = await getAccount(null, 0, true) // get the source account
    //console.log(sourceAccount) // log the source account
  },
  getPrivateKey: async (seed, index) =>
    (await getAccount(seed, index, true)).privateKey, // get the private key
  getAddress: async (seed, index) => (await getAccount(seed, index)).address, // get the address
  balance: async (seed, index) => {
    // get the balance
    try {
      return (await getAccount(seed, index)).balance // return the balance
    } catch (e) {
      console.log(e.message) // log the error
    }
    return 0
  },
  tx: async (seed, index, destination, amount) => {
    // send a transfer
    try {
      return sendTransfer(
        new Date().getTime(),
        'casper' + (TESTNET ? '-test' : ''),
        await getAccount(seed, index, true),
        destination,
        amount
      ) // send the transfer
    } catch (e) {
      return e.message // return the error
    }
  },
  nfts: async (address) => {
    // get the nfts
    console.log('get Casper NFTs for the address:', address) // log the address
  },
}
