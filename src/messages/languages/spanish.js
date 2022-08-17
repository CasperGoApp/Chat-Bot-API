module.exports = {
  // export module
  keywords: {
    // keywords
    wallet: [
      // wallet identified by keywords
      'cartera', // cartera
      'carteras', // carteras
      'balance', // balance
      'balances', // balances
      'saldo', // saldo
      'saldos', // saldos
      'cuenta', // cuenta
      'cuentas', // cuentas
    ],
    deposit: ['depósito', 'depositar', 'recibir', 'direccion', 'direcciones'], // deposit identified by keywords
    send: ['enviar', 'envia', 'mandar'], // send identified by keywords
    settings: ['settings', 'setting', 'account', 'accounts', 'system'], // settings identified by keywords
    menu: ['menu', 'ayuda', 'opciones', 'como'], // menu identified by keywords
    support: ['soporte', 'cliente', 'servicio', 'asistencia'], // support identified by keywords
    block: ['bloque'], // block identified by keywords
    stay: ['quedar'], // stay identified by keywords
    price: ['precio', 'precio', 'tarifas'], // price identified by keywords
    staking: ['staking'], // staking identified by keywords
    lottery: ['loteria', 'lotería'], // lottery identified by keywords
    share: ['compartir', 'enlacar'], // share identified by keywords
    vault: ['bóveda', 'bóvedas'], // vault identified by keywords
    history: ['historial', 'reportes', 'reporte'], // history identified by keywords
    nft: ['nft', 'nfts'], // nft identified by keywords
  },
  all: 'todo', // all
  onboard: {
    // onboard
    type: 'template', // type
    name: 'go_onboard', // name
    // content
    content:
      '✋ Su registro está completo. Para configurar su cuenta haz clic aquí: {{1}}', // content message
  },
  block: {
    // block
    // content
    content:
      '❌ Bloquear cuentas. Para bloquear el número del teléfono registrado en los próximos 5 minutos recibirás una confirmación que su cuenta ha sido  desactivada con la opción de volver a habilitar el servicio en cualquier momento, responda si decidas de no bloquear su cuenta escoges ``` QUEDARSE ```. Para restablecer la cuenta.', // content message
  },
  deposit: {
    // deposit
    // content
    content:
      '💸 Cómo depositar en DiviGo \n```{{1}}```\nOpciones:\nConteste con la moneda para obtener la dirección del depósito y el código QR.', // content message
  },
  daily: {
    // daily
    type: 'template', // type
    name: 'go_transxer', // name
    // content
    content:
      '🤑 Recibiste una transferencia de {{1}} de {{2}}. Tu saldo nuevo es {{3}} ', // content message
  },
  deposited: {
    // deposited
    type: 'template', // type
    name: 'go_deposit', // name
    content:
      '🤑 Has recibido un depósito nuevo {{1}}.\nEl nuevo saldo es {{2}}', // content message
  },
  balanceChange: {
    // balanceChange
    // content
    content:
      '🤑Tu saldo de {{1}} acaba de ser actualizado desde la cadena de blockchain .', // content message
  },
  prices: { content: '💱 *Tasas de cambio (tasas de mercado)*\n```{{1}}```' }, // prices content message
  settings: {
    // settings
    // content
    content:
      '✋ Para configurar los ajustes avanzados, haga clic aquí: https://comm.v2.divigo.tech/start/{{1}}', // content message
  },
  history: {
    // history
    // content
    content:
      '📊 Historial de la cuenta\nTodos los detalles de sus transacciones se han guardado en las cadenas de blockchain y lo hemos respaldado para que lo descargue en formato Excel, incluyendo el tipo de cambio en el momento en que recibió o envió los fondos. Haga clic aquí para abrir el historial de su cuenta: https://comm.v2.divigo.tech/history/{{1}}', // content message
  },
  menu: {
    // menu
    // content
    content:
      '❓ Comandos de ayuda¡ Estos comandos de UNA  te darán acceso rápido a tus activos!```❓ AYUDA: Incluir esta lista de comandos\n🤷‍♂️ SOPORTE: Informar un problema👝 CARTERA: Mostrar todas mis monedas\n💸 DEPÓSITO: Obtener información de depósito\n💰 ENVIAR: Iniciar proceso de envío📱 RECARGA: Recarga de teléfonos móviles\n📁 ACTIVOS: Lista de todos mis NFT\n📊 HISTORIAL: Detalla mi historial de transacciones\n📈 GANANCIAS: Rendimiento de la cuenta\n💱 PRECIO: Tipos de cambio actuales\n☁️ BÓVEDA: Administrar bóveda de apuestas (s)\n\n🪙 ESTAR: Cómo funciona el replanteo\n💵 LOTERÍA: Cómo funciona la lotería\n🎁 COMPARTIR: Comparte DiviGo y gana\n❌ BLOCKCHAIN: Bloquea mi cuenta```\n\nEstos comandos RÁPIDOS te permitirán  realizar acciones complejas.\nenviar 5 divi a divigo\nenviar 5 usd en divi a divigo', // content message
  },
  support: {
    // support
    // content
    content:
      '🤷‍♂️ Solicite soporte. Esperamos su respuesta, normalmente respondemos a todas las solicitudes dentro de las 24 horas. Haz clic aquí para informar tu problema con más detalle: https://comm.v2.divigo.tech/help/{{1}}', // content message
  },
  staking: {
    // staking
    // content
    content:
      '🪙 DiviGo es una billetera que depende de la comunidad y la participación de los usuarios. Esto significa que todos los fondos están participando las 24 horas del día los 7 días de la semana. Los usuarios no tienen que verificar su billetera ni asegurarse de tener acceso a Internet estable. Cuando alguien gana una apuesta en el grupo, esas ganancias se dividen entre todos los usuarios del grupo,proporcionalmente a la cantidad de DIVI que tienen. Para obtener más información sobre las apuestas en DiviGo visite la página web www.divigo.tech#faq', // content message
  },
  lottery: {
    // lottery
    // content
    content:
      '💵 La Lotería Divi ocurre una vez por semana, con 10 direcciones ganando 25,200 DIVI cada una, y una dirección ganando el gran premio de 252,000 DIVI.\nEl grupo de apuestas es una excelente manera para que los monederos más pequeños participen activamente en la lotería.\nSi el grupo gana, esos fondos se dividen entre todos los usuarios del grupo.\nPara obtener más información sobre la lotería y las apuestas, visite www.divigo.tech#faq.', // content message
  },
  share: {
    // share
    // content
    content:
      '🎁 ¡Comparte DiviGo y gana!\nCopie y pegue el siguiente enlace, o haga clic en el botón de compartir', // content message
  },
  shareMessage: {
    // shareMessage
    // content
    content:
      'Bienvenido a DiviGo - Administrador de billetera móvil\n*{{1}}* quisiera recomendar DiviGo, el administrador de billetera móvil. Si está interesado en probar DiviGo, confirme abriendo el siguiente enlace y comience hoy mismo. https://comm.v2.divigo.tech/{{2}} ', // content message
  },
  nft: {
    // nft
    // content
    content:
      '🎁 Recopilar, crear y seleccionar\nResponder con BROWSE, CREATE o PROPIEDAD', // content message
  },
  published: {
    // published
    // content
    content:
      '💰 Acaba de enviar *{{1}}* con el ID de transacción: {{2}}\nLas transacciones de blockchain pueden tardar más en reflejarse en la dirección de destino.', // content message
  },
  noSendYourself: {
    // noSendYourself
    content: '⚠️ Lo siento no se puede enviar a fundos a la misma cuenta', // content message
  },
  noSendSystem: {
    // noSendSystem
    content: '⚠️ Lo sentimos, no puede enviar a *direcciones del sistema*', // content message
  },
  sendFromAccount: {
    // sendFromAccount
    content: '❓ Por favor elige la moneda que deseas enviar?', // content message
  },
  sendFromAmount: {
    // sendFromAmount
    content: '❓ Por favor díganos cuánto le gustaría enviar?', // content message
  },
  sendFromDestination: {
    // sendFromDestination
    content: '❓ Por favor díganos a quién le gustaría enviar?', // content message
  },
  sendFromHelp: {
    // sendFromHelp
    // content
    content:
      '❓ Para enviar, incluya la cantidad, la moneda y el destino en un mensaje. Por ejemplo, envíe 10 entradas DIVI\ni\nenvíe entradas 10 USD DIVI \ni\n envíe entradas TODAS LAS DIVI', // content message
  },
  errorSend: { content: '❓ Parece que hubo un erry al enviar: {{1}}' }, // errorSend
  sendConfirm: { content: 'Confirme para enviar {{1}}' }, // sendConfirm
  sendFromErrorDestination: {
    // sendFromErrorDestination
    content: '❓Parece que *{{1}}* no estás registrado en nuestro sistema', // content message
  },
  sendFromErrorBalance: {
    // sendFromErrorBalance
    content: '⚠️ No tienes saldo suficiente para enviar *{{1}}*.', // content message
  },
  sendMoneyConfirmed: {
    // sendMoneyConfirmed
    // content
    content:
      '🤑 *Hola {{1}},* acaba de enviar una transferencia a {{2}} por la cantidad de {{3}}. Su nuevo saldo es {{4}}.', // content message
  },
  sendMoneyReceived: {
    // sendMoneyReceived
    type: 'template', // type
    name: 'go_transfer', // name
    // content
    content:
      '🤑 *Hola {{1}},* acabas de recibir una transferencia de {{2}}. Su nuevo saldo es {{3}}.', // content message
  },
  sendFailed: { content: '⚠️ El envío ha fallado.' }, // sendFailed
  stay: {
    // stay
    content: '¡Su cuenta ha sido desbloqueada Bienvenido de nuevo a DiviGo!', // content message
  },
  update: {
    // update
    type: 'template', // type
    name: 'go_onboard', // name
    // content
    content:
      '✋ Su configuración ha sido actualizado. Para configuración avanzada, haga clic aquí: {{1}}', // content message
  },
  vaultAmount: {
    // vaultAmount
    content: '❓ Por favor, díganos cuánto le gustaría agregar a una bóveda', // content message
  },
  vaultNotAvailable: {
    // vaultNotAvailable
    content: '⚠️ Esta función no está disponible en su cuenta.', // content message
  },
  vaultError: {
    // vaultError
    content: '❓ Parece que hubo un problema con la bóveda: {{1}}', // content message
  },
  vaultConfirm: {
    // vaultConfirm
    // content
    content:
      'Por favor, confirme con la bóveda {{1}} y pague la tarifa de la bóveda para este mes de {{2}} haciendo clic en este enlace: {{3}}', // content message
  },
  vaultNoFunds: {
    // vaultNoFunds
    content: '⚠️ No tienes saldo suficiente para guardar *{{1}}*', // content message
  },
  wallets: { content: '👝  Cartera{{1}} para {{2}}\n```{{3}}```' }, // wallets
}
