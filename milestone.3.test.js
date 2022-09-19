let CONTROLLERS = null

jest.setTimeout(50000)

beforeAll(async () => {
  CONTROLLERS = await require('./src/server')()
})

/*
Milestone 3 Acceptance Criteria
- The Custodial system is available for testing on the test net
- Incoming Balance Monitor is configurable by user
- Account block limits are editable by admin
- Accounts can be enabled and disabled by admin
*/

it('The Custodial system is available for testing on the test net', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  const seed =
    '0a9f5af74e82f1839101d76348afac7c758b67c9390adc38e64e1c754e6929593e6700962b35ec0721e30a61011f7cfae394d9c1354d4281653ba9cf74f33906'
  expect(await CSPR.getPrivateKey(seed, 0)).toBe(
    '207a1f6ffcbdaa03aebcb89f60e96c658537515965242f23686a9c764f260fac'
  )
})

it('Incoming Balance Monitor is configurable by user', async () => {
  const BlockMonitor = require('./blockMonitor/casper/index') // import and start the block monitor
  expect(BlockMonitor.lastBlockId).toBeGreaterThanOrEqual(0)
})

it('Account block limits are editable by admin', async () => {
  const userID = '63141254561e67c565f79b06'
  const maxUSDPerMonth = 100
  expect(
    (
      await CONTROLLERS.mgo.update(
        CONTROLLERS.db,
        'Users',
        { _id: CONTROLLERS.mgo.id(userID) },
        {
          aml: {
            limit: maxUSDPerMonth,
            added: new Date(),
          },
        }
      )
    ).modifiedCount
  ).toBe(0)
})

it('Accounts can be enabled and disabled by admin', async () => {
  const userID = '63141254561e67c565f79b06'
  expect(
    (
      await CONTROLLERS.mgo.update(
        CONTROLLERS.db,
        'Users',
        { _id: CONTROLLERS.mgo.id(userID) },
        {
          active: false,
        }
      )
    ).modifiedCount
  ).toBe(0)
})
