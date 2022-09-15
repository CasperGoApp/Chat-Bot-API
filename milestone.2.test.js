let CONTROLLERS = null

beforeAll(async () => {
  jest.setTimeout(50000)
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

it('PENDING', async () => {
  const DIVI_RPC = require('./blockMonitor/src/divi/divi-rpc')
  expect(await DIVI_RPC.getBlockCount()).toBeGreaterThanOrEqual(0)
})
