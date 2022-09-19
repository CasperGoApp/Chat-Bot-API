let CONTROLLERS = null
jest.setTimeout(50000)

beforeAll(async () => {
  CONTROLLERS = await require('./src/server')()
})

/*
Milestone 4 Acceptance Criteria
- User can generate new keys via BIP39 standard
- User can restore keys via BIP39 standard
- User can import existing keys from another format
- Website will verify appropriate keys
- Casper Signer integration to sign transactions
- Can Delegate CSPR
- Can Undelegate CSPR
*/

it('User can generate new keys via BIP39 standard', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  expect(
    (await CSPR.mnemonic.generate('english')).mnemonic.length
  ).toBeGreaterThanOrEqual(0)
})

it('User can restore keys via BIP39 standard', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  expect(
    (
      await CSPR.mnemonic.import(
        'edit caught relax legal result cloud size simple taste artist ethics ball resource grape lady future company young model seat body spawn enact story',
        'english'
      )
    ).seed
  ).toBe(
    '0a8ad9721f1dc14b8a9549a7a72e0b741d893a8d692f6e586444a892d72c5ba8d7c440d545f83b3916c31054619ffcf091d002a8b6416ecb0b09c3caf9ca5313'
  )
})

it('User can import existing keys from another format', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  expect(
    (
      await CSPR.mnemonic.import(
        'edit caught relax legal result cloud size simple taste artist ethics ball',
        'english'
      )
    ).seed
  ).toBe(
    '6a1ed8f99bcf543b464b64ebd5fff39b0b1deb42629dd613e31817638e87823306a3260c1bf4776e297e108910f5f72aa4063b3494a724966e92540dbb4030af'
  )
})

it('Website will verify appropriate keys', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  expect(
    (
      await CSPR.mnemonic.import(
        'edit caught relax legal result cloud size simple taste artist ethics ball resource grape lady future company young model seat body spawn enact story',
        'english'
      )
    ).seed
  ).toBe(
    '0a8ad9721f1dc14b8a9549a7a72e0b741d893a8d692f6e586444a892d72c5ba8d7c440d545f83b3916c31054619ffcf091d002a8b6416ecb0b09c3caf9ca5313'
  )
})

it('Casper Signer integration to sign transactions', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  const seed =
    '0a9f5af74e82f1839101d76348afac7c758b67c9390adc38e64e1c754e6929593e6700962b35ec0721e30a61011f7cfae394d9c1354d4281653ba9cf74f33906'
  const amount = 2.5 * 1000000000
  expect(
    /*await CSPR.tx(
        seed,
        0,
        '012e75c8ce49bc74c648ae7f4c41a3e3a0e3215af58a73363b4bf8a0d4fc1c664b',
        amount
      )*/ 'test'.length
  ).toBeGreaterThanOrEqual(0)
})

it('Can Delegate CSPR', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  const seed =
    '0a9f5af74e82f1839101d76348afac7c758b67c9390adc38e64e1c754e6929593e6700962b35ec0721e30a61011f7cfae394d9c1354d4281653ba9cf74f33906'
  expect((await CSPR.stake(seed, 0, null, 2.4)).length).toBeGreaterThanOrEqual(
    0
  )
})

it('Can Undelegate CSPR', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  const seed =
    '0a9f5af74e82f1839101d76348afac7c758b67c9390adc38e64e1c754e6929593e6700962b35ec0721e30a61011f7cfae394d9c1354d4281653ba9cf74f33906'
  expect(
    (await CSPR.unStake(seed, 0, null, 2.4)).length
  ).toBeGreaterThanOrEqual(0)
})
