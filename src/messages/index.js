require('dotenv').config()  //  load .env

const languages = { // languages
  english: require('./languages/english'),  // english
  spanish: require('./languages/spanish'),  // spanish
  arabic: require('./languages/arabic') // arabic
}

const DEFAULT_LANGUAGE = 'english'  // default language

const providers = {}  // providers
let fieldList = [ // fields
  'msg30Sec', // last 30 seconds
  'msg1Min',  // last 1 minute
  'msg3Min',  // last 3 minutes
  'msg5Min',  // last 5 minutes
  'msg10Min', // last 10 minutes
  'msgHour',  // last hour
  'msgDay'  // last day
]
let fields = {  // fields
  msg30Sec: 30, // last 30 seconds
  msg1Min: 60,  // last 1 minute
  msg3Min: 3 * 60,  // last 3 minutes
  msg5Min: 5 * 60,  // last 5 minutes
  msg10Min: 10 * 60,  // last 10 minutes
  msgHour: 60 * 60, // last hour
  msgDay: 23 * 60 * 60  // last day
}

let CONTROLLERS = null  // controllers

const getRecents = async (time, existingUsers, field) => {  // get recents
  if( existingUsers.length < 1 )  {
    return []
  }
  const searchForOr = [{}, {}]  // search for or
  searchForOr[0][field] = { $exists: false }  // search for or
  searchForOr[1][field] = false // search for or
  const lastMessageDate = new Date()  // last message date
  const updateField = {}  // update field
  let isFound = false // is found
  for (let i = 0; !isFound && i < fieldList.length; i++) {  // for each field
    isFound = fieldList[i] == field // is found
  }
  updateField[field] = lastMessageDate  // update field
  lastMessageDate.setTime(lastMessageDate.getTime() - time) // last message date
  const recentMessages = await CONTROLLERS.mgo.query(CONTROLLERS.db, 'Users', { // recent messages
    _id: { $nin: existingUsers }, // _id
    lastMessageOn: { $lt: lastMessageDate },  // last message on
    $or: searchForOr  // or
  })
  await CONTROLLERS.mgo.update( // update
    CONTROLLERS.db, // db
    'Users',  // collection
    {
      _id: { $nin: existingUsers }, // _id
      lastMessageOn: { $lt: lastMessageDate },  // last message on
      $or: searchForOr  // or
    },
    updateField // update field
  )
  return recentMessages // recent messages
}

const messages = {  // messages
  start: (oCONTROLLERS, providerList, saveMessages) => {  // start
    CONTROLLERS = oCONTROLLERS  // controllers
    setInterval(messages.checkLastMessages, 20 * 1000)  // check last messages
    for (let i = 0; i < providerList.length; i++) { // for each provider
      let canInstall = false  // can install
      switch (providerList[i]) {  // switch
        case 'clickatell':  // clickatell
          canInstall =  // can install
            process.env.CLICKATELL_API_KEY && // clickatell api key
            process.env.CLICKATELL_INTERGRATION_ID && // clickatell intergration id
            process.env.CLICKATELL_INTERGRATION_NAME  // clickatell intergration name
          break // break
        case 'telegram':  // telegram
          canInstall = process.env.TELEGRAM_API_KEY && process.env.BASE_URL // can install
          break // break
        case 'botmaker':  // botmaker
          canInstall = !!process.env.BOTMAKER_TOKEN // can install
          break // break
        case 'signal':  // signal
          canInstall = !!process.env.SOURCE_NUMBER  // can install
          break // break
      }
      if (canInstall) { // can install
        providers[providerList[i]] = require('./' + providerList[i])  // provider
        providers[providerList[i]].load(saveMessages) // load
      }
    }
  },
  sendTimedUpdates: async (seconds, list) => {  // send timed updates
    switch (seconds) {  // switch
      case 30:  // 30 seconds
        break // break
      case 60:  // 60 seconds
        break // break
      case 180: // 180 seconds
        for (let i = 0; i < list.length; i++) { // for each user
          if (list[i].pending) {  // pending
            await messages.message( // message
              list[i].route,  // route
              list[i].number, // number
              list[i].language, // language
              'min3ReplyPending', // message
              []  // params
            )
          }
        }
        break // break
      case 300: // 300 seconds
        for (let i = 0; i < list.length; i++) { // for each user
          if (list[i].pending) {  // pending
            await messages.message( // message
              list[i].route,  // route
              list[i].number, // number
              list[i].language, // language
              'min5ReplyPending', // message
              [list[i].msgQuiet ? '' : '\n🤫  QUIET : Stop these reminders']  // params
            )
          }
        }
        break // break
      case 600: // 600 seconds
        break // break
      case 3600:  // 1 hour
        break // break
      case 82800: // 1 day
        for (let i = 0; i < list.length; i++) { // for each user
          await messages.message( // message
            list[i].route,  // route
            list[i].number, // number
            list[i].language, // language
            'min3Reply',  // message
            [list[i].msgQuiet ? '' : '\n🤫  QUIET : Stop these reminders']  // params
          )
        }
        break // break
    }
  },
  checkLastMessages: async _ => { // check last messages
    const existingUsers = []  // existing users
    for (let x in fields) { // for each field
      const list = await getRecents(fields[x] * 1000, existingUsers, x) // list
      if (list && list.length > 0) {  // list
        const sendToList = [] // send to list
        for (let i = 0; i < list.length; i++) { // for each user
          if (!list[i].msgQuiet) {  // msg quiet
            existingUsers.push(CONTROLLERS.mgo.id(list[i]._id)) // existing users
            sendToList.push(list[i])  // send to list
          }
        }
        if (sendToList.length > 0) {  // send to list
          messages.sendTimedUpdates(fields[x], sendToList)  // send timed updates
        }
      }
    }
  },
  message: async (provider, to, language, name, args) => {  // message
    const languageData = languages[language]  // language data
      ? languages[language] // language data
      : languages[DEFAULT_LANGUAGE] // language data
    if (languageData[name]) { // language data
      const started = new Date()  // started
      started.setHours(started.getHours() - 24) // started
      const received = await CONTROLLERS.mgo.singleQuery( // received
        CONTROLLERS.db, // db
        'logInbound', // collection
        {
          added: { $gt: started },  // added
          from: to, // from
          route: provider // route
        }
      )
      if (
        provider == 'botmaker' && // botmaker
        languageData[name].type == 'template' &&  // template
        languageData[name].botMaker &&  // bot maker
        languageData[name].botMaker.name  // bot maker name
      ) {
        const variableArray = {}  // variable array
        for (let i = 0; i < args.length; i++) { // for each arg
          variableArray[languageData[name].botMaker.variables[i]] = args[i] // variable array
        }
        return await messages.send.template(  // send template
          provider, // provider
          to, // to
          languageData[name].botMaker.name, // name
          variableArray,  // variable array
          languageData[name].content  // content
        )
      } else if ( // else if 
        provider == 'clickatell' && // clickatell
        languageData[name].type == 'template' &&  // template
        !received // received
      ) {
        return await messages.send.template(  // send template
          provider, // provider
          to, // to
          languageData[name].name,  // name
          args, // args
          languageData[name].content  // content
        )
      } else {  // else 
        let text = languageData[name].content // text
        for (let i = 0; i < args.length; i++) { // for each arg
          text = text.replace('{{' + (i + 1) + '}}', args[i]) // text
        }
        return await messages.send.text(provider, to, text) // send text
      }
    }
  },
  send: { // send
    text: async (provider, to, message) =>  // text
      await providers[provider].send.text(to, message), // send text
    file: async (provider, to, message, file, ext) => // file
      await providers[provider].send.file(to, file, message, ext),  // send file
    location: async (provider, to, lat, long, name, address) => // location
      await providers[provider].send.location(to, lat, long, name, address),  // send location
    template: async (provider, to, name, parameterArray, baseText) => // template
      await providers[provider].send.template(  // send template
        to, // to
        name, // name
        parameterArray, // parameter array
        baseText  // base text
      )
  },
  signal: { // signal
    register: async (voiceCall, catpcha) => // register
      providers.signal.register(voiceCall, catpcha),  // register 
    verify: async (verifyCode, pinCode) =>  // verify
      providers.signal.verify(verifyCode, pinCode), // verify 
    profileName: async name => providers.signal.profile.name(name), // profile name
    profileAvatar: async image => providers.signal.profile.avatar(image), // profile avatar
    receive: async (addToList, saveUpdate) => // receive
      providers.signal.receive.start(addToList, saveUpdate) // receive
  },
  telegram: { // telegram
    sendFile: (id, res) => providers.telegram.sendFile(id, res),  // send file
    receive: (data, addToList, saveUpdate, res) =>  // receive
      providers.telegram.receive(data, addToList, saveUpdate, res)  // receive
  },
  clickatell: { // clickatell
    receive: (data, addToList, saveUpdate, res) =>  // receive
      providers.clickatell.receive(data, addToList, saveUpdate, res)  // receive
  },
  botmaker: { // botmaker
    sendFile: (id, res) => providers.botmaker.sendFile(id, res),  // send file
    receive: (data, addToList, saveUpdate, res) =>  // receive
      providers.botmaker.receive(data, addToList, saveUpdate, res)  // receive
  }
}

module.exports = messages // export
