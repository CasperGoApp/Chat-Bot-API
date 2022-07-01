module.exports = async (CONTROLLERS, coinUser, message, isLoud) => { // export module
  let messageToSend = null  // message to send
  let msgQuiet = false  // msg quiet
  if (coinUser && coinUser.msgQuiet && isLoud) {  // if is loud
    messageToSend = 'quietSettingDisabled'  // message to send
  } else if (coinUser && !coinUser.msgQuiet && !isLoud) { // if is quiet
    messageToSend = 'quietSettingEnabled' // message to send
    msgQuiet = true // msg quiet
  } else if (coinUser && coinUser.msgQuiet && !isLoud) {  // if is quiet
    await CONTROLLERS.messages.message( // message
      message.route,  // route
      message.from, // route
      coinUser.language,  // language
      'alreadyInQuietMode', // type
      []  // params
    ) // params
  }
  if (messageToSend) {  // if message to send
    await CONTROLLERS.mgo.update( // update
      CONTROLLERS.db, // db
      'Users',  // collection
      { _id: CONTROLLERS.mgo.id(coinUser._id) }, // search for
      { msgQuiet }  // update to set msg quiet
    ) 
    await CONTROLLERS.messages.message( // message
      message.route,  // route
      message.from, // route
      coinUser.language,  // language
      messageToSend,  // type
      []  // params
    )
  }
}
