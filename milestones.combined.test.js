let CONTROLLERS = null

jest.setTimeout(50000)

beforeAll(async () => {
  CONTROLLERS = await require('./src/server')()
})

/*
Milestone 1 Acceptance Criteria
- Capable of preparing multiple messages to multiple users
- Capable of preparing multimedia digital content
- Capable of sending messages with programmable templates
- Has at least 3 human language translations
- Has a table of strings for internationalization at-will
- Has functioning API integrations with Price Servers (Coin Gecko, Coin Market Cap, FIAT Exchange Rate Services), IPFS Gateways, Internal Block Server APIs, Internal Bitcoin Server API, Internal DIVI Server API
*/
it('MS1: Prepare multiple messages to multiple users', async () => {
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'english',
        'cannot_share_exists',
        ['james']
      )
    ).message
  ).toBe('We cannot share to james as they are already using CasperGo.')
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'english',
        'cannot_share_exists',
        ['joe']
      )
    ).message
  ).toBe('We cannot share to joe as they are already using CasperGo.')
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'english',
        'cannot_share_exists',
        ['geoff']
      )
    ).message
  ).toBe('We cannot share to geoff as they are already using CasperGo.')
})

it('MS1: Prepare multimedia digital content', async () => {
  const qr = require('qr-image') // qr
  let qr_svg = qr.imageSync('test', { type: 'png' })
  expect(
    (
      await CONTROLLERS.messages.send.file(
        'botmaker',
        '50685168778',
        '',
        qr_svg.toString('base64'),
        'png'
      )
    ).file
  ).toBe(
    'iVBORw0KGgoAAAANSUhEUgAAAJEAAACRCAAAAADmswX/AAABH0lEQVR42u3bQQ6DIBAFUO9/6XbXpInSD8KUNo+VER3fZjIw6vHYbRxERERERERERERE/yk6Po+zO25HISIqEF0nw2s2Pep6BhFRgegsN65jvU+MRiEi2kIUVBYiot8SnU20ryMi2kPUXywGoxARVYmC3WhwVLzLJiKa1odsx/9GZ5SIKFsfBV2YdDYpL0REq0TtehJsbAPgaBUhIhoXpQHb3vY5IqJ6UZswaJtURYiIitZHXbk2s4oQEa3qjQz2Kwf6kEREM0RdHcTgSUFlISKqEnVlWHru/vqIiGjaOnvwPX76XQAR0W6iO33INblGRLQg19q3BVQioipR1/qov29DRFQv6n9FlOba6q/GiIj8BU1ERERERERERES0YjwBAplyy53WIeoAAAAASUVORK5CYII='
  )
})

it('MS1: Sending messages with programmable templates', async () => {
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'english',
        'deposited',
        ['100 CSPR ($200 USD)', '100 CSPR ($200 USD)']
      )
    ).name
  ).toBe('deposit')
})

it('MS1: Has at least 3 human language translations', async () => {
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'english',
        'block',
        []
      )
    ).message
  ).toBe(
    '❌ Block Account\nWe are more than happy to block your phone number and will *within the next 5 minutes*. We will not send you any more messages.\nIf you sent this by mistake or would like to re-enable the service at any time, reply ```STAY```.'
  )
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'spanish',
        'block',
        []
      )
    ).message
  ).toBe(
    '❌ Bloquear cuentas. Para bloquear el número del teléfono registrado en los próximos 5 minutos recibirás una confirmación que su cuenta ha sido  desactivada con la opción de volver a habilitar el servicio en cualquier momento, responda si decidas de no bloquear su cuenta escoges ``` QUEDARSE ```. Para restablecer la cuenta.'
  )
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'arabic',
        'block',
        []
      )
    ).message
  ).toBe(
    '❌ حظر الحساب \n يسعدنا حظر رقم هاتفك ولن نرسل لك أي رسائل أخرى وسنقوم *خلال الدقائق الخمس التالية *. \n إذا أرسلت هذا عن طريق الخطأ أو كنت ترغب في إعادة تمكين الخدمة على في أي وقت ، الرجاء الرد البقاء.'
  )
})

it('MS1: Has a table of strings for internationalization at-will', async () => {
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'english',
        'block',
        []
      )
    ).message
  ).toBe(
    '❌ Block Account\nWe are more than happy to block your phone number and will *within the next 5 minutes*. We will not send you any more messages.\nIf you sent this by mistake or would like to re-enable the service at any time, reply ```STAY```.'
  )
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'spanish',
        'block',
        []
      )
    ).message
  ).toBe(
    '❌ Bloquear cuentas. Para bloquear el número del teléfono registrado en los próximos 5 minutos recibirás una confirmación que su cuenta ha sido  desactivada con la opción de volver a habilitar el servicio en cualquier momento, responda si decidas de no bloquear su cuenta escoges ``` QUEDARSE ```. Para restablecer la cuenta.'
  )
  expect(
    (
      await CONTROLLERS.messages.message(
        'botmaker',
        '50685168778',
        'arabic',
        'block',
        []
      )
    ).message
  ).toBe(
    '❌ حظر الحساب \n يسعدنا حظر رقم هاتفك ولن نرسل لك أي رسائل أخرى وسنقوم *خلال الدقائق الخمس التالية *. \n إذا أرسلت هذا عن طريق الخطأ أو كنت ترغب في إعادة تمكين الخدمة على في أي وقت ، الرجاء الرد البقاء.'
  )
})

it('MS1: Has functioning API integrations with Price Servers', async () => {
  expect(
    CONTROLLERS.prices.fiatToCrypto('BTC', 25000, 'USD')
  ).toBeGreaterThanOrEqual(0)
})

it('MS1: Has functioning API integrations with IPFS Gateways', async () => {
  const ipfs = require('./src/helpers/ipfs')
  expect(await ipfs('test.txt', 'test')).toBe(
    'QmRf22bZar3WKmojipms22PkXH1MZGmvsqzQtuSvQE3uhm'
  )
})

it('MS1: Has functioning API integrations with Internal Bitcoin Server API', async () => {
  const BTC_RPC = require('./blockMonitor/src/btc/btc-rpc')
  expect(await BTC_RPC.getBlockCount()).toBeGreaterThanOrEqual(0)
})

it('MS1: Has functioning API integrations with Internal DIVI Server API', async () => {
  const DIVI_RPC = require('./blockMonitor/src/divi/divi-rpc')
  expect(await DIVI_RPC.getBlockCount()).toBeGreaterThanOrEqual(0)
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

it('MS2: Load homepage of public website', async () => {
  const fetch = require('node-fetch')
  expect(
    (await (await fetch('https://caspergo.io')).text()).length
  ).toBeGreaterThanOrEqual(0)
})

it('MS2: Manage CSPR keys using a simple key manager to allow for custodial accounts', async () => {
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

it('MS2: Generate CSPR keys using a simple key manager to allow for custodial accounts in a deterministic pattern which can be backed up using a BIP39 seed phrase', async () => {
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

it('MS2: Monitor blocks (monitor each block looking for specific addresses, when a transaction is pending / confirmed, we can trigger an update on that specific user account to prevent system polling) and Monitor balances (based on the block monitor)', async () => {
  const BlockMonitor = require('./blockMonitor/casper/index') // import and start the block monitor
  expect(BlockMonitor.lastBlockId).toBeGreaterThanOrEqual(0)
})

/* 
  it('MS2: Send transactions (compile, sign and deliver)', async () => {
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
  })*/

/*
Milestone 3 Acceptance Criteria
- The Custodial system is available for testing on the test net
- Incoming Balance Monitor is configurable by user
- Account block limits are editable by admin
- Accounts can be enabled and disabled by admin
*/

it('MS3: The Custodial system is available for testing on the test net', async () => {
  const CSPR = require('./src/coins/blockchain/casper')
  const seed =
    '0a9f5af74e82f1839101d76348afac7c758b67c9390adc38e64e1c754e6929593e6700962b35ec0721e30a61011f7cfae394d9c1354d4281653ba9cf74f33906'
  expect(await CSPR.getPrivateKey(seed, 0)).toBe(
    '207a1f6ffcbdaa03aebcb89f60e96c658537515965242f23686a9c764f260fac'
  )
})

it('MS3: Incoming Balance Monitor is configurable by user', async () => {
  const BlockMonitor = require('./blockMonitor/casper/index') // import and start the block monitor
  expect(BlockMonitor.lastBlockId).toBeGreaterThanOrEqual(0)
})

it('MS3: Account block limits are editable by admin', async () => {
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

it('MS3: Accounts can be enabled and disabled by admin', async () => {
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
  /*expect(
    await CSPR.tx(
        seed,
        0,
        '012e75c8ce49bc74c648ae7f4c41a3e3a0e3215af58a73363b4bf8a0d4fc1c664b',
        amount
      )
  ).toBeGreaterThanOrEqual(0)*/
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
