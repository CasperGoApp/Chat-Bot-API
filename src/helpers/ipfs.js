require('dotenv').config() //  load .env
const formdata = require('form-data') // import formdata
const fetch = require('node-fetch') // import fetch
const mime = require('./mime') // import mime

const ipfs = async (name, data) => {
  // ipfs
  const form = new formdata() // form
  form.append('file', data, {
    // form file
    contentType: mime.get.fromFileName(name), // contentType
    filename: name.split('/').pop(), // filename
  })
  const serverResponse = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    // serverResponse
    method: 'POST', // method
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.INFURA_PROJECT_ID +
            ':' +
            process.env.INFURA_PROJECT_SECRET
        ).toString('base64'),
    },
    body: form, // body
  }) // fetch
  try {
    // try
    const result = await serverResponse.json() // result
    return result && result.Hash ? result.Hash : null // return result Hash else null
  } catch (e) {
    console.log(e)
  } // catch
}

module.exports = ipfs // export ipfs
