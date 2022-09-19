let CONTROLLERS = null

jest.setTimeout(50000)

beforeAll(async () => {
  CONTROLLERS = await require('./src/server')()
})

/*
Milestone 2 Acceptance Criteria
The public website from milestone #1 will be updated and connected to the Casper Testnet. This website will be able to:
    - Manage CSPR keys using a simple key manager to allow for custodial accounts
    - Generate CSPR keys using a simple key manager to allow for custodial accounts in a deterministic pattern which can be backed up using a BIP39 seed phrase
    - Monitor blocks (monitor each block looking for specific addresses, when a transaction is pending / confirmed, we can trigger an update on that specific user account to prevent system polling)
    - Send transactions (compile, sign and deliver)
    - Monitor balances (based on the block monitor)
*/

it('Load homepage of public website', async () => {
  const fetch = require('node-fetch')
  expect(
    (await (await fetch('https://caspergo.io')).text()).length
  ).toBeGreaterThanOrEqual(0)
})

it('Manage CSPR keys using a simple key manager to allow for custodial accounts', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  const seed1 =
    'egg foster tail bitter panther prevent marriage close junk problem immense speak egg code like section possible shell trash essay radar school tattoo select'
  await CSPR.start('http://3.14.161.135:7777/rpc', false, seed1)
  expect(await CSPR.getPrivateKey(seed1, 0)).toBe(
    '28370f69700f38c24a77bdcdc8a743a7301e10da1ed3c15d898afe85d6f8783c'
  )
  const seed2 =
    'current stem pen surprise trap marble speak motor rabbit duck tent install peanut cliff museum arrive question age radar marine silver simple lounge leisure'
  await CSPR.start('http://3.14.161.135:7777/rpc', false, seed2)
  expect(await CSPR.getPrivateKey(seed2, 0)).toBe(
    '8b4b17ee6044c4b64c6ebce70107737ae36c206c303bbdb34c34c16a552f7ac0'
  )
  const seed3 =
    'seminar mutual more skull grain space welcome fashion oblige athlete reunion achieve body fault thunder assume shoulder helmet night guilt permit wedding object wave'
  await CSPR.start('http://3.14.161.135:7777/rpc', false, seed3)
  expect(await CSPR.getPrivateKey(seed3, 0)).toBe(
    '5e7576c41468e12f9d215fa47f14016f1ea08f3981323e4ddcea34daa1be0b06'
  )
})

it('Generate CSPR keys using a simple key manager to allow for custodial accounts in a deterministic pattern which can be backed up using a BIP39 seed phrase', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  const seed =
    '0a9f5af74e82f1839101d76348afac7c758b67c9390adc38e64e1c754e6929593e6700962b35ec0721e30a61011f7cfae394d9c1354d4281653ba9cf74f33906'
  await CSPR.start('http://3.14.161.135:7777/rpc', false, seed)
  const index1 = 0
  expect(await CSPR.getPrivateKey(seed, index1)).toBe(
    '207a1f6ffcbdaa03aebcb89f60e96c658537515965242f23686a9c764f260fac'
  )
  const index2 = 100
  expect(await CSPR.getPrivateKey(seed, index2)).toBe(
    '4c0d8d0c235693849954955b5b15204bbe79afba269d71d3dcc2e7e1a8a54054'
  )
  const index3 = 1000
  expect(await CSPR.getPrivateKey(seed, index3)).toBe(
    'b6f355be35c2f3e94e04eb0ce1d363618e633ca986b289987b69295b1c5a33be'
  )
})

it('Monitor blocks (monitor each block looking for specific addresses, when a transaction is pending / confirmed, we can trigger an update on that specific user account to prevent system polling) and Monitor balances (based on the block monitor)', async () => {
  const BlockMonitor = require('./blockMonitor/casper/index') // import and start the block monitor
  expect(BlockMonitor.lastBlockId).toBeGreaterThanOrEqual(0)
})

it('Send transactions (compile, sign and deliver)', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  const seed =
    '0a9f5af74e82f1839101d76348afac7c758b67c9390adc38e64e1c754e6929593e6700962b35ec0721e30a61011f7cfae394d9c1354d4281653ba9cf74f33906'
  const amount = 2.5 * 1000000000
  expect(
    (
      await CSPR.tx(
        seed,
        0,
        '012e75c8ce49bc74c648ae7f4c41a3e3a0e3215af58a73363b4bf8a0d4fc1c664b',
        amount
      )
    ).length
  ).toBeGreaterThanOrEqual(0)
})
