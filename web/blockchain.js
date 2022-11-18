const { KeyFactory, EncryptionType, CasperHDWallet } = require('casper-storage') // import casper-storage
const casperClientSDK = require('casper-js-sdk') // import casper-js-sdk
const {
  Keys,
  CasperClient,
  CLPublicKey,
  DeployUtil,
  CLValueBuilder,
  RuntimeArgs,
} = require('casper-js-sdk') // import casper-js-sdk functions
const { ERC20Client, constants } = require('casper-erc20-js-client')
const bip39 = require('bip39')
const RPC = require('../../../blockMonitor/casper/rpc') //import the RPC object

const keyManager = KeyFactory.getInstance() // get the key manager

const hex = (x) => Buffer.from(x).toString('hex') // convert to hex

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) // sleep function

const ERC20_PAYMENT_AMOUNT = 0.00001 // set the erc20 payment amount

const DELAY_FOR_INITIAL_PAYMENT = 60 * 2 * 1000 // 2 minutes
const NEW_ACCOUNT_AMOUNT = 2.5 * 1000000000 // 2.5 minimum amount to send to a new account
const PAYMENT_AMOUNT = 100000000 // 100000000 nano for a transfer fee
const GAS_PRICE = 1 // gas price for transfer
const SEND_TTL = 1800000 // 30 minutes

const fromMotes = (amount) => parseFloat(amount) / 1000000000

const toMotes = (amount) => parseFloat(amount) * 1000000000

const auctionContract = Uint8Array.from(
  // auction contract
  Buffer.from(
    'ccb576d6ce6dec84a551e48f0d0b7af89ddba44c7390b690036257a04a3ae9ea', // auction contract hash
    'hex'
  )
)

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

const buildStakeDeploy = (
  baseAccount,
  args,
  paymentAmount,
  NETWORK_NAME,
  contract
) => {
  const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME) // create the deploy params
  const runTimeArgs = RuntimeArgs.fromMap(args) // create the runtime args
  const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
    // create the session
    auctionContract, // contract hash
    contract, // contract name
    runTimeArgs // runtime args
  )
  const payment = DeployUtil.standardPayment(paymentAmount) // create the payment
  return DeployUtil.makeDeploy(deployParams, session, payment) // create the deploy
}

const getStakeDeploy = async (
  fromAccount, // from account
  validator, // validator
  amount, // amount
  NETWORK_NAME, // network name
  isStart // is start
) => {
  try {
    const casperClient = new CasperClient(RPC.url) // create the casper client
    const signKeyPair = Keys.Ed25519.parseKeyPair(
      // create the sign key pair
      Buffer.from(fromAccount.public.key, 'hex'), // public key
      Buffer.from(fromAccount.privateKey, 'hex') // private key
    )
    const fromAccPk = signKeyPair.publicKey // from account public key
    const validatorPk = CLPublicKey.fromHex(validator) // validator public key
    const dTS = {
      delegator: fromAccPk, // delegator
      validator: validatorPk, // validator
      amount: CLValueBuilder.u512(toMotes(amount)), // amount
    }
    const deploy = buildStakeDeploy(
      // build the stake deploy
      fromAccPk, // from account public key
      dTS,
      toMotes(isStart ? 3 : 0.00001), // payment amount
      NETWORK_NAME, // network name
      isStart ? 'delegate' : 'undelegate' // contract name
    )
    const signedDeploy = DeployUtil.signDeploy(deploy, signKeyPair) // sign the deploy
    return await casperClient.putDeploy(signedDeploy) // send the deploy
  } catch (error) {
    console.error(error) // log the error
    throw new Error(`Failed to get stake deploy.`) // throw the error
  }
}

const getEraBestStaker = async (_) => {
  // get the era best staker
  const auctionInfo = await RPC.getAuctionInfo() // get the auction info
  const eraValidatorList = [] // set the era validator list
  for (let value of auctionInfo.bids) {
    // for each bid
    if (
      !value.bid.inactive && // if the bid is not inactive
      value.bid.delegators.length > 300 && // if the bid has more than 300 delegators
      value.bid.delegators.length < 900 // if the bid has less than 900 delegators
    ) {
      eraValidatorList.push({
        // add the validator to the list
        key: value.public_key, // public key
        amount: fromMotes(value.bid.staked_amount), // amount
        fee: value.bid.delegation_rate, // fee
        delegators: value.bid.delegators.length, // delegators
      })
    }
  }
  eraValidatorList.sort((a, b) => (a.fee == b.fee ? 0 : a.fee > b.fee ? 1 : -1)) // sort the list by fee
  return eraValidatorList[0] // return the best staker
}

const getErc20Balance = async (erc20, signKeyPair) => {
  // get the erc20 balance
  let balance = 0 // set the balance
  try {
    balance = await erc20.balanceOf(signKeyPair) // get the balance
  } catch (e) {}
  return balance // return the balance
}

const getErc20 = async (url, network, contractVersionHash) => {
  // get the erc20
  const erc20 = new ERC20Client(url, network) // create the erc20 client
  await erc20.setContractHash(contractVersionHash) // set the contract hash
  return erc20 // return the erc20
}

const getErc20Data = async (erc20, signKeyPair) => ({
  // get the erc20 data
  name: await erc20.name(), // get the name
  symbol: await erc20.symbol(), // get the symbol
  totalSupply: (await erc20.totalSupply()).toString(), // get the total supply
  decimals: (await erc20.decimals()).toString(), // get the decimals
  balance: (await getErc20Balance(erc20, signKeyPair)).toString(), // get the balance
})

const sendErc20 = (
  erc20,
  signKeyPair,
  to,
  amount,
  paymentAmount // send erc20
) =>
  erc20.transfer(
    // transfer
    signKeyPair, // sign key pair
    CLPublicKey.fromHex(to), // to
    toMotes(amount).toString(), // amount
    toMotes(paymentAmount).toString() // payment amount
  )

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
  mnemonic: {
    generate: async (language) => {
      bip39.setDefaultWordlist(language)
      const mnemonic = bip39.generateMnemonic(256)
      return {
        mnemonic: mnemonic,
        seed: await module.exports.seed.getFromMnemonic(mnemonic, language),
      }
    },
    import: async (mnemonic, language) => ({
      mnemonic: mnemonic,
      seed: await module.exports.seed.getFromMnemonic(mnemonic, language),
    }),
  },
  seed: {
    getFromMnemonic: async (mnemonic, language) => {
      bip39.setDefaultWordlist(language)
      const seed = await bip39.mnemonicToSeed(mnemonic)
      return seed.toString('hex')
    },
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
  tx: async (seed, index, destination, erc20Contract) => {
    // send a transfer
    try {
      if (erc20Contract) {
        // if the erc20 contract is set
        return sendErc20(
          // send the erc20
          await getErc20(RPC.url, 'casper', erc20Contract), // get the erc20
          Keys.Ed25519.parseKeyPair(
            // create the sign key pair
            Buffer.from(mainAccount.public.key, 'hex'), // public key
            Buffer.from(mainAccount.privateKey, 'hex') // private key
          ),
          destination, // destination
          amount, // amount
          ERC20_PAYMENT_AMOUNT // payment amount
        )
      } else {
        return sendTransfer(
          new Date().getTime(),
          'casper' + (TESTNET ? '-test' : ''),
          await getAccount(seed, index, true),
          destination,
          amount
        ) // send the transfer
      }
    } catch (e) {
      return e.message // return the error
    }
  },
  nfts: async (address) => {
    // get the nfts
    console.log('get Casper NFTs for the address:', address) // log the address
  },
  stake: async (
    seed,
    index,
    validator,
    amount // stake
  ) =>
    getStakeDeploy(
      // get the stake deploy
      await getAccount(seed, index, true), // get the account
      validator ? validator : (await getEraBestStaker()).key, // get the validator
      amount, // amount
      'casper', // network name
      true // isStarting
    ),
  unStake: async (
    seed,
    index,
    validator,
    amount // unstake
  ) =>
    getStakeDeploy(
      // get the stake deploy
      await getAccount(seed, index, true), // get the account
      validator ? validator : (await getEraBestStaker()).key, // get the validator
      amount, // amount
      'casper', // network name
      false // isStarting
    ),
}
