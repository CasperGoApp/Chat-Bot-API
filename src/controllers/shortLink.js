const fetch = require('node-fetch') // fetch import

module.exports = {
  // export module
  add: async (link, expires, code) => {
    // add
    const dTs = { link } // d ts
    if (expires) {
      // if
      dTs.expires = new Date() // expires
      dTs.expires.setMinutes(dTs.expires.getMinutes() + expires) // expires set minutes
      dTs.expires = dTs.expires.getTime() // expires time
    }
    if (code) {
      // if code
      dTs.code = code // code
    }
    return (
      await fetch('https://lg.cr/add', {
        // fetch
        headers: { 'Content-Type': 'application/json' }, // headers
        method: 'POST', // method
        body: JSON.stringify(dTs), // body
      })
    ).json() // json
  },
}
