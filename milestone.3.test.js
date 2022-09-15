let CONTROLLERS = null

beforeAll(async () => {
  jest.setTimeout(50000)
  CONTROLLERS = await require('./src/server')()
})

/*
Milestone 3 Acceptance Criteria
- The Custodial system is available for testing on the test net
- Incoming Balance Monitor is configurable by user
- Account block limits are editable by admin
- Accounts can be enabled and disabled by admin
*/

it('PENDING', async () => {
  const DIVI_RPC = require('./blockMonitor/src/divi/divi-rpc')
  expect(await DIVI_RPC.getBlockCount()).toBeGreaterThanOrEqual(0)
})
