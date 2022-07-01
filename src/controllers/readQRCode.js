const Jimp = require('jimp') // jimp import
const qrCode = require('qrcode-reader') // qr code import

module.exports = dataBase64 =>  // export module data base64
  new Promise((resolve, reject) => {  // promise
    Jimp.read(Buffer.from(dataBase64, 'base64'), (err, image) => { // read image
      if (err) {  // if error
        reject(err) // reject error
      } else {  // if no error
        const qrcode = new qrCode() // qr code
        qrcode.callback = (err, value) => { // callback
          if (err) {  // if error
            reject(err) // reject error
          } else {  // if no error
            resolve(value.result) // resolve value
          }
        }
        qrcode.decode(image.bitmap) // decode image
      }
    })
  })
