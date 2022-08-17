module.exports = async (CONTROLLERS, coinUser, message) => {
  // export module
  await CONTROLLERS.mgo.update(
    // update
    CONTROLLERS.db, // db
    'Users', // collection
    { _id: CONTROLLERS.mgo.id(coinUser._id) }, // search for
    { blocked: null } // update to set blocked to null
  )
  await CONTROLLERS.messages.message(
    // message
    message.route, // route
    message.from, // route
    coinUser.language, // language
    'stay', // type
    [] // params
  )
}
