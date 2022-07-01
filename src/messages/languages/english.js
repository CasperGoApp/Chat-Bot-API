module.exports = {  // export module
  keywords: { // keywords
    wallet: ['wallet', 'wallets', 'balance', 'balances', 'account', 'accounts'],  // wallet, wallets, balance, balances, account, accounts keywords identified similarly in context
    deposit: ['deposit', 'receive', 'address', 'addresses', 'addr'],  // deposit, receive, address, addresses, addr keywords identified similarly in context
    send: ['send'], // send keword
    settings: [ // settings keywords identified similarly in context
      'settings', // settings keyword
      'setting',  // setting keyword
      'account',  // account keyword
      'accounts', // accounts keyword
      'system',  // system keyword
      'user', // user keyword
      'username'  // username keyword
    ],
    menu: ['menu', 'help', 'options', 'how', 'commands'], // menu, help, options, how, commands keywords identified similarly in context
    support: ['support', 'customer', 'service', 'assistance'],  // support, customer, service, assistance keywords identified similarly in context
    block: ['block', 'quit', 'remove'], // block, quit, remove keywords identified similarly in context
    stay: ['stay'], // stay keyword
    price: ['price', 'prices', 'exchange', 'rates'],  // price, prices, exchange, rates keywords identified similarly in context
    staking: ['staking'], // staking keyword
    lottery: ['lottery'], // lottery keyword
    share: ['share', 'link', 'refer', 'ob', 'onboard'], // share, link, refer, ob, onboard keywords identified similarly in context
    vault: ['vault', 'vaults'], // vault, vaults keywords identified similarly in context
    history: ['history', 'report'], // history, report keywords identified similarly in context
    nft: ['nft', 'nfts', 'collectible', 'collectibles'],  // nft, nfts, collectible, collectibles keywords identified similarly in context
    mint: ['mint', 'create', 'curate'], // mint, create, curate keywords identified similarly in context
    earning: ['earning', 'earn'], // earning, earn keywords identified similarly in context
    quiet: ['shutup', 'quiet'], // quiet, shutup keywords identified similarly in context
    loud: ['loud']  // loud keywords identified similarly in context
  },
  stopProcess: [  // stopProcess identified by keywords
    'cancel', // cancel
    'stop', // stop
    'exit', // exit
    'quit', // quit
    'no', // no
    'support',  // support
    'help', // help
    'reset' // reset
  ],
  all: 'all', // all
  onboard: {  // onboard
    type: 'template', // type
    name: 'go_onboard', // name
    botMaker: { // botMaker
      name: 'registration_complete',  // name
      variables: ['friend', 'link'] // friend, link
    },
    content:  // content
      '✋ Registration with {{1}} is complete. To configure advanced settings, click here: {{2}}' // content message
  },
  min3ReplyPending: { // min3ReplyPending
    content:  // content
      'Just a reminder that this process will timeout shortly unless you reply.'  // content message
  },
  min3Reply: {  // min3Reply
    content:  // content
      "We haven't heard from you in a while, we want to remind you of the functions:\n❓ HELP : List all commands\n🤷‍♂️  SUPPORT : Report an issue\n👝  WALLET : List all my coins\n💸  DEPOSIT : List my deposit addresses\n💰  SEND : Send crypto{{1}}" // content message
  },
  min5ReplyPending: { // min5ReplyPending
    content:  // content
      'The process has cancelled out for taking too long, we want to remind you of the functions:\n❓ HELP : List all commands\n🤷‍♂️  SUPPORT : Report an issue\n👝  WALLET : List all my coins\n💸  DEPOSIT : List my deposit addresses\n💰  SEND : Send crypto{{1}}'  // content message
  },
  block: {  // block
    content:  // content
      '❌ Block Account\nWe are more than happy to block your phone number and will *within the next 5 minutes*. We will not send you any more messages.\nIf you sent this by mistake or would like to re-enable the service at any time, reply ```STAY```.'  // content message
  },
  deposit: {  // deposit
    content:  // content
      '💸 *Your CasperGo Accounts:*\n```{{1}}```\n*Advanced:*\nSend ```deposit divi``` to get ONLY the DIVI address\nSend ```deposit divi qr``` to get your deposit to QR code!{{2}}' // content message
  },
  daily: {  // daily
    type: 'template', // type
    name: 'go_transxer',  // name
    botMaker: { // botMaker
      name: 'transfer_int', // name
      variables: ['transferAmount', 'newBalance'] // transferAmount, newBalance
    },
    content: '💰 You received {{1}}.\nNew balance is {{2}}.'  // content message
  },
  deposited: {  // deposited
    type: 'template', // type
    name: 'go_deposit', // name
    botMaker: { // botMaker
      name: 'deposit',  // name
      variables: ['depositAmount', 'newBalance']  // depositAmount, newBalance
    },
    content: '🤑 You received a deposit of {{1}}.\nNew balance is {{2}}'  // content message
  },
  balanceChange: {  // balanceChange
    content: '🤑 Your {{1}} balance has just been updated from the blockchain.' // content message
  },
  prices: { content: '💱  *Exchange Rates (Market Rates)*\n```{{1}}```' },  // prices content message
  settings: { // settings
    content: '✋ To configure advanced settings, click here: {{1}}' // content message
  },
  history: {  // history
    content:  // content
      '📊 Account History\nAll the details of your transactions have been saved on the blockchains and we have backed this up for you to download in Excel format, including the exchange rate at the time you received or sent funds.\nClick here to open your account history: {{1}}' // content message
  },
  menu: { // menu
    content:  // content
      "Below are some simple commands that you can text to be able to send, receive, hold, and even earn crypto.\n\n❓ *Help Commands*\nThese EASY commands will give you quick access to your assets! (PS: they are not case sensitive.)\n\n*To refer your friends and earn Divi:*\n🎁 SHARE : Share CasperGo & earn\nThis command will share and track your referral to that phone number. (Please enter country code)\nExample: SHARE 17875551212\n\n*To check on your holdings:*\n👝 WALLET : List all my coins\n📈 EARN : Check staking income\n\n💸 DEPOSIT : List my deposit addresses\n💰 SEND : Send crypto\n📊 HISTORY : Transaction history\n\n*Learn about crypto:*\n💱 PRICE : Check crypto prices\n🪙 STAKING : How staking works\n💵 LOTTERY : How the lottery works\n\n*To get help:*\n❓HELP : Get this list of commands\n🤷‍♂️ SUPPORT : Report an issue\n❌ BLOCK : Block my account\n\n*These QUICK commands are shortcuts for you to easily send crypto to your friends' wallet.*\nSEND 5 divi to caspergo\nSEND 5 usd in divi to caspergo" //\n📁 NFT : List all my NFTs'  // content message
  },
  support: {  // support
    content:  // content
      '🤷‍♂️ We are looking forward to hearing from you and try to respond within 24 hours. Report your issue in detail here: {{1}}' // content message
  },
  staking: {  // staking
    content:  // content
      "🪙 CasperGo is a managed staking wallet. This means that all funds in the pool are staking 24/7.\nUsers don't have to check on their wallet, or make sure that they have access to stable internet.\nWhen an address wins a stake in the pool, those winnings are split between all the users in the pool, proportional to the amount of DIVI they hold.\nFor more information on staking on CasperGo, visit caspergo.io#faq\n"  // content message
  },
  lottery: {  // lottery
    content:  // content
      '💵 The Divi Lottery occurs once per week, with 10 addresses winning 25,200DIVI each, and one address winning the grand prize of 252,000DIVI.\nThe staking pool is a great way for smaller wallets to actively participate in the lotto.\nIf the pool wins, those funds are split proportionally to the individual amount staked, between all of the users in the pool.\nFor more information on the lotto and staking, visit caspergo.io#faq.' // content message
  },
  share: {  // share
    content:  // content
      '🎁 Share CasperGo and earn!\nIf you would like to recommend a specific person, please send ```share PHONENUMBER```, using their phone number.\nOr you can forward, share or copy and paste the following link:'  // content message
  },
  shareMessage: { // shareMessage
    content:  // content
      "Welcome to CasperGo - Mobile wallet manager\n*{{1}}* would like to recommend CasperGo, the mobile wallet manager. If you're interested in trying out CasperGo, open this link and get started now!\n{{2}}" // content message
  },
  shareMessageSent: { // shareMessageSent
    content:  // content
      'Your message to {{1}} has been sent and you will be notified if they have accepted the request!' // content message
  },
  cannot_share_exists: {  // cannot_share_exists
    content: 'We cannot share to {{1}} as they are already using CasperGo.' // content message
  },
  cannot_share_referred: {  // cannot_share_referred
    content:  // content
      'We cannot share to {{1}} as they are have already been referred to CasperGo.'  // content message
  },
  published: {  // published
    content:  // content
      '💰 You have just sent *{{1}}* with the transaction id: {{2}}\nBlockchain transactions may take longer to reflect in the destination address.'  // content message
  },
  noSendYourself: { // noSendYourself
    content:  // content
      "⚠️ We're sorry, you cannot send to *yourself*.\nPlease start the sending process again." // content message
  },
  noSendSystem: { // noSendSystem
    content:  // content
      "⚠️ We're sorry, you cannot send to *system addresses*.\nPlease start the sending process again." // content message
  },
  sendFromAccount: {  // sendFromAccount
    content:  // content
      '❓ Which coin would you like to send? (or send CANCEL to exit this process)' // content message
  },
  sendFromAmount: { // sendFromAmount
    content:  // content
      '❓ How much you would like to send? (or send CANCEL to exit this process)' // content message
  },
  sendFromDestination: {  // sendFromDestination
    content:  // content
      '❓ To whom would you like to send? (or send CANCEL to exit this process)'  // content message
  },
  sendFromHelp: { // sendFromHelp
    content:  // content
      '❓ To send, include the amount, coin and destination in one message.\ne.g.send 10 DIVI encke\nor\nsend encke 10 USD DIVI\nor\nsend encke ALL DIVI' // content message
  },
  errorSend: { content: '❓ It seems that there was an issue sending: {{1}}.' },  // errorSend
  sendConfirm: { content: 'Send {{1}}' }, // sendConfirm
  sendFromErrorDestination: { // sendFromErrorDestination
    content:  // content
      '❓ It seems that *{{1}}* is not registered in our system nor can we find where to send.' // content message
  },
  sendFromErrorBalance: { // sendFromErrorBalance
    content: "⚠️ You don't have enough balance to send *{{1}}*."  // content message
  },
  sendMoneyConfirmed: { // sendMoneyConfirmed
    content:  // content
      '🤑 *Hello {{1}},* you have just sent a transfer to {{2}} for the amount of {{3}}. Your new balance is {{4}}.'  // content message
  },
  sendMoneyReceived: {  // sendMoneyReceived
    type: 'template', // type
    name: 'go_transfer',  // name
    botMaker: { // botMaker
      name: 'transfer', // name
      variables: ['transferAmount', 'friendName', 'newBalance'] // variables
    },
    content:  // content
      '🤑 *Hello {{1}},* you have just received a transfer of {{2}}. Your new balance is {{3}}.'  // content message
  },
  sendFailed: { content: '⚠️ The sending has failed.' },  // sendFailed
  stay: { // stay
    content:  // content
      'Your account has been unblocked and you can use it as normal!\nWelcome back to CasperGo!'  // content message
  },
  update: { // update
    type: 'template', // type
    name: 'go_onboard', // name
    botMaker: { // botMaker
      name: 'registration_complete',  // name
      variables: ['friend', 'link'] // variables
    },
    content:  // content
      '✋ Your settings have been updated. To configure advanced settings, click here: {{1}}' // content message
  },
  vaultAmount: {  // vaultAmount
    content: '❓ How much you would like to add to a staking vault?'  // content message
  },
  vaultNotAvailable: {  // vaultNotAvailable
    content: '⚠️ This feature is not available on your account.'  // content message
  },
  vaultError: { // vaultError
    content: '❓ It seems that there was an issue vaulting: {{1}}.' // content message
  },
  vaultConfirm: { // vaultConfirm
    content:  // content
      'Would you like to create a vault {{1}} and pay the vaulting fee for this month of {{2}} by clicking on this link: {{3}}' // content message
  },
  vaultNoFunds: { // vaultNoFunds
    content: "⚠️ You don't have enough balance to vault *{{1}}*." // content message
  },
  wallets: { content: '👝  Wallet{{1}} for {{2}}\n```{{3}}```' }, // wallets
  registerDeposit: {  // registerDeposit
    type: 'template', // type
    name: 'register_deposit', // name
    botMaker: { // botMaker
      name: 'register_deposit', // name
      variables: [  // variables
        'friend',   // friend
        'friendName', // friendName
        'depositAmount',  // depositAmount
        'accountType',  // accountType
        'friend', // friend
        'expiryTime'  // expiryTime
      ]
    },
    content:  // content
      'Hello from {{1}}!\n{{2}} sent you a deposit of {{3}} to be credited to a new account in {{4}}!\nReply "Yes" to set up your {{5}} account and receive the deposit.\nYou must respond within {{6}} hours, or the deposit will expire and return to the sender.'  // content message
  },
  registerDepositSent: {  // registerDepositSent
    content:  // content
      'Your deposit request to {{1}} has been sent and you will be notified if they have accepted the request, if not the {{2}} will be returned to your account within {{3}} hours.' // content message
  },
  shareTmpl: {  // shareTmpl
    type: 'template', // type
    name: 'referral', // name
    botMaker: {   // botMaker
      name: 'referral', // name
      variables: ['friend', 'friendName', 'friend', 'link'] // variables
    },
    content:  // content
      "Welcome to {{1}} - Mobile wallet manager\n*{{2}}* would like to recommend {{3}}. If you're interested, confirm by opening the following link and get started today!\n{{4}}"  // content message
  },
  cantShareNoMoney: { // cantShareNoMoney
    content:  // content
      'You cannot refer your friend at *{{1}}* giving them {{2}} as your available balance is only {{3}}.'  // content message
  },
  shareNeverReceivedDeposit: {  // shareNeverReceivedDeposit
    content:  // content
      'Your friend at *{{1}}* never accepted the invite to {{2}}, Your deposit of {{3}} has been returned to your spendable balance.' // content message
  },
  shareReceivedDeposit: { // shareReceivedDeposit
    content:  // content
      'Your friend at *{{1}}* has just joined {{2}} and has received the deposit of {{3}}!' // content message
  },
  creatingAccount: {  // creatingAccount
    content: 'Please wait, we are creating your account.' // content message
  },
  award: {  // award
    type: 'template', // type
    name: 'received_award', // name
    botMaker: { // botMaker
      name: 'received', // name
      variables: ['received', 'transferType', 'newBalance'] // variables
    },
    content: '🪙 Congrats! You received {{1}} with {{2}}!\nNew balance is {{3}}.' // content message
  },
  noEarningAccount: { // noEarningAccount
    content:  // content
      'You do not have an account with CasperGo to be earning yet. Please start with our pooled services now!'  // content message
  },
  earnings: { // earnings
    content: '🤑 *Hello {{1}},*\nYour earnings with CasperGo are:{{2}}' // content message
  },
  accountUpdated: { content: 'Your account information has been updated!' },  // accountUpdated
  paymentRequest: { // paymentRequest
    type: 'template', // type
    name: 'payment',  // name
    botMaker: { // botMaker
      name: 'payment',  // name
      variables: ['friend', 'paymentAmount', 'link']  // variables
    },
    content:  // content
      '💰 {{1}} requests to be paid {{2}}\nTo approve this, confirm by {{3}}' // content message
  },
  noNFTs: { // noNFTs
    content:  // content
      "🎁 Collect, Create and Curate\nYou don't yet have any NFTs! You can mint a new NFT in-chat, just send the word MINT to get started." // content message
  },
  nft: {  // nft
    content:  // content
      '🎁 Collect, Create and Curate\nYou have {{1}}{{2}}\nPlease reply with which to view.'  // content message
  },
  nftRequestContent: {  // nftRequestContent
    content:  // content
      '❓ To start minting a new NFT, please reply with the photo or video to mint!'  // content message
  },
  nftRequestName: { // nftRequestName
    content:  // content
      '❓ Got it, now, what NAME (less than 30 characters) would you like for your NFT?'  // content message
  },
  nftRequestDescription: {  // nftRequestDescription
    content:  // content
      '❓ Got it, now, what DESCRIPTION (as long as you like) would you like for your NFT?' // content message
  },
  nftCreateConfirm: { // nftCreateConfirm
    content:  // content
      '🎁 We will mint your new *{{1}}* NFT with the description *{{2}}* right now! Please reply Yes to confirm or anything else to cancel.'  // content message
  },
  nftCreateComplete: {  // nftCreateComplete
    content:  // content
      '🎁 Your new NFT, *{{1}}* has just been MINTED! You can view it anytime by sending NFT in this chat!\nYou can also view this at: {{2}}' // content message
  },
  nftCreateError: { // nftCreateError
    content:  // content
      '⚠️ Your new NFT, *{{1}}* could not be created because of an error. We have notified our support staff and will notify you when this has been resolved.'  // content message
  },
  nftData: {  // nftData
    content:  // content
      '🎁 Your NFT on the *{{1}}* contract:\nName: {{2}}\nDescritpion: {{3}}\nOpen: {{4}}'  // content message
  },
  diviSendDisabled: { // diviSendDisabled
    content:  // content
      'Attention! CasperGo DIVI Wallets are under maintenance. Please do not deposit or withdraw DIVI from your CasperGo account, all funds are safe and continue to stake we will advise when its up and running again.\nThank you, CasperGo Support.' // content message
  },
  nftsDisabled: { // nftsDisabled
    content:  // content
      'Hello, we are experiencing issues with the NFT system. We are working to restore services now.\nThank you for your patience, CasperGo Support.'  // content message
  },
  quietSettingEnabled: {  // quietSettingEnabled
    content:  // content
      '🤫 We have stopped the reminder messages. Please remember to send HELP at any time to get the command list!\nSend LOUD at any time to re-enable these messages.' // content message
  },
  quietSettingDisabled: { // quietSettingDisabled
    content:  // content
      '🗣️ We have restored the reminder commands, send QUIET at any time to disable.' // content message
  },
  alreadyInQuietMode: { // alreadyInQuietMode
    content:  // content
      '🤫 You are already in QUIET mode.\nSend LOUD at any time to re-enable these messages.' // content message
  },
  blockedSendAML: { // blockedSendAML
    content:  // content
      'We cannot process this transaction. You want to send {{1}} and have {{2}} blocked and a total balance of {{3}}. Please setup your advanced account to unblock the funds here {{4}}'  // content message
  },
  processCancelled: { // processCancelled
    content: 'The process has been cancelled.'  // content message
  },
  newUserReq: { // newUserReq
    type: 'template', // type
    name: 'new_user_req', // name
    botMaker: { // botMaker
      name: 'new_user_req', // name
      variables: ['friendName', 'friend', 'friendName'] // variables
    },
    content:  // content
      "Welcome to {{1}} - Mobile wallet manager\n{{2}} would like to recommend {{3}}. If you're interested, confirm, replying Yes and get started today!" // content message
  },
  newUserDep: { // newUserDep
    type: 'template', // type
    name: 'new_user_dep', // name
    botMaker: { // botMaker
      name: 'new_user_dep', // name
      variables: [  // variables
        'friendName', // friendName
        'friend', // friend
        'friendName', // friendName
        'depositAmount',  // depositAmount
        'expiryTime'  // expiryTime
      ]
    },
    content:  // content
      "Welcome to {{1}} - Mobile wallet manager\n{{2}} would like to recommend {{3}}. And has placed you a deposit of {{4}} which will be canceled within {{5}} hours if you have not confirmed. If you're interested, confirm, replying Yes and get started today!"  // content message
  },
  purchaseMade: { // purchaseMade
    type: 'template', // type
    name: 'payment_made', // name
    botMaker: { // botMaker
      name: 'payment_made', // name
      variables: ['paymentAmount']  // variables
    },
    content:  // content
      'Your purchase of {{1}} has been completed. You can reply here anytime for more information!'   // content message
  }
}
