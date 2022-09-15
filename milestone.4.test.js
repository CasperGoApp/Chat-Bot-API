let CONTROLLERS = null

beforeAll(async () => {
  jest.setTimeout(50000)
  CONTROLLERS = await require('./src/server')()
})

/*
Milestone 4 Acceptance Criteria
- User can generate new keys via BIP39 standard
- User can restore keys via BIP39 standard
- User can import existing keys from another format
- Website will verify appropriate keys
- Casper Signer integration to sign transactions
*/

it('PENDING', async () => {
  const DIVI_RPC = require('./blockMonitor/src/divi/divi-rpc')
  expect(await DIVI_RPC.getBlockCount()).toBeGreaterThanOrEqual(0)
})
