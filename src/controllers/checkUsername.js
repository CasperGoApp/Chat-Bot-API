const APP = require('gnodejs') // import app gnodejs

module.exports = async (CONTROLLERS, username) => { // export module
  username = username.trim().toLowerCase()  // username
  const blockedUser = await CONTROLLERS.mgo.singleQuery(  // get blocked user
    CONTROLLERS.db, // db
    'blockedUsernames', // collection
    {
      name: username  // name
    }
  )
  if (blockedUser) {  // check blocked user
    return false  // return false
  }
  const existingUser = await CONTROLLERS.mgo.singleQuery( // get existing user
    CONTROLLERS.db, // db
    'Users',  // collection
    { username, active: true }  // search for
  )
  if (existingUser) { // check existing user
    return false  // return false
  }
  return true
}
