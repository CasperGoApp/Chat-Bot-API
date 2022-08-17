module.exports = async (CONTROLLERS, coinUser, message) => {
  // export module
  await CONTROLLERS.mgo.update(
    // update
    CONTROLLERS.db, // db
    'Users', // collection
    { _id: CONTROLLERS.mgo.id(coinUser._id) }, // search for
    { blocked: new Date() } // update
  )
  await CONTROLLERS.messages.message(
    // message
    message.route, // route
    message.from, // from
    coinUser.language, // language
    'block', // type
    [] // params
  )
}
