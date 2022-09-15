let CONTROLLERS = null

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
it('Prepare multiple messages to multiple users', async () => {
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

it('Prepare multimedia digital content', async () => {
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

it('Sending messages with programmable templates', async () => {
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

it('Has at least 3 human language translations', async () => {
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

it('Has a table of strings for internationalization at-will', async () => {
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

it('Has functioning API integrations with Price Servers', async () => {
  expect(
    CONTROLLERS.prices.fiatToCrypto('BTC', 25000, 'USD')
  ).toBeGreaterThanOrEqual(0)
})

it('Has functioning API integrations with IPFS Gateways', async () => {
  const ipfs = require('./src/helpers/ipfs')
  //console.log(await ipfs('test.txt', 'test'))
  //expect(12).toBe(123)
})

it('Has functioning API integrations with Internal Bitcoin Server API', async () => {
  //getblockcount
  //expect(12).toBe(123)
  const BTC_RPC = require('./blockMonitor/src/btc/btc-rpc')
  console.log(await BTC_RPC.loadWallet('testwallet'))
  console.log('BTC_RPC.getBlockCount', await BTC_RPC.getBlockCount())
})

it('Has functioning API integrations with Internal DIVI Server API', async () => {
  //getblockcount
  //expect(12).toBe(123)
  const DIVI_RPC = require('./blockMonitor/src/divi/divi-rpc')
  console.log('DIVI_RPC.getBlockCount', await DIVI_RPC.getBlockCount())
})

/*
- Has functioning API integrations with Price Servers (Coin Gecko, Coin Market Cap, FIAT Exchange Rate Services), IPFS Gateways, Internal Block Server APIs, Internal Bitcoin Server API, Internal DIVI Server API
 */

/* 
Milestone 2 Acceptance Criteria
The public website from milestone #1 will be updated and connected to the Casper Testnet. This website will be able to:
    - Manage CSPR keys using a simple key manager to allow for custodial accounts
    - Generate CSPR keys using a simple key manager to allow for custodial accounts in a deterministic pattern which can be backed up using a BIP39 seed phrase
    - Monitor blocks (monitor each block looking for specific addresses, when a transaction is pending / confirmed, we can trigger an update on that specific user account to prevent system polling)
    - Send transactions (compile, sign and deliver)
    - Monitor balances (based on the block monitor)
*/
/* 
Milestone 3 Acceptance Criteria
- The Custodial system is available for testing on the test net
- Incoming Balance Monitor is configurable by user
- Account block limits are editable by admin
- Accounts can be enabled and disabled by admin
*/
/* 
Milestone 4 Acceptance Criteria

- User can generate new keys via BIP39 standard
- User can restore keys via BIP39 standard
- User can import existing keys from another format
- Website will verify appropriate keys
- Casper Signer integration to sign transactions

*/
