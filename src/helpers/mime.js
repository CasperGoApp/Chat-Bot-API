const mime = {  // mime
  list: { // list
    png: { mime: 'image/png', type: 'Photo' },  // png
    gif: { mime: 'image/gif', type: 'Animation' },  // gif
    jpg: { mime: 'image/jpeg', type: 'Photo' }, // jpg
    jpeg: { mime: 'image/jpeg', type: 'Photo' },  // jpeg
    pdf: { mime: 'application/pdf', type: 'Document' }, // pdf
    doc: { mime: 'application/msword', type: 'Document' },  // doc
    ppt: { mime: 'application/vnd.ms-powerpoint', type: 'Document' }, // ppt
    xls: { mime: 'application/vnd.ms-excel', type: 'Document' },  // xls
    acc: { mime: 'audio/acc', type: 'Audio' },  // acc
    aac: { mime: 'audio/x-aac', type: 'Audio' },  // aac
    mp4: { mime: 'video/mp4', type: 'Video' },  // mp4
    '3gpp': { mime: 'video/3gpp', type: 'Video' },  // 3gpp
    mp3: { mime: 'audio/mpeg', type: 'Audio' }, // mp3
    amr: { mime: 'audio/amr', type: 'Audio' },  // amr
    opus: { mime: 'audio/ogg', type: 'Audio' }, // opus
    ts: { mime: 'audio/ts', type: 'Audio' },  // ts
    wav: { mime: 'audio/wav', type: 'Audio' },  // wav
    txt: { mime: 'text/plain', type: 'Document' },  // txt
    svg: { mime: 'image/svg+xml', type: 'Document' }, // svg
    m3u8: { mime: 'application/vnd.apple.mpegurl', type: 'Document' },  // m3u8
    json: { mime: 'application/json', type: 'Document' }  // json
  },
  defaultNames: { // default names
    photo: 'image.png', // photo
    document: 'document.pdf', // document
    video: 'video.mp4', // video
    voice: 'voice.opus',  // voice
    audio: 'audio.mp3', // audio
    sticker: 'sticker.gif', // sticker
    animation: 'sticker.gif'  // animation
  },
  get: {  // get
    fromFileName: (fileName, mimeType) => { // fromFileName
      if (fileName) { // if fileName
        fileName = fileName.split('.')  // fileName split
        if (fileName && fileName.length > 0) {  // if fileName split
          fileName = fileName.slice(-1) // fileName slice
          if (fileName.length > 0 && fileName[0]) { // if fileName slice
            fileName = fileName[0].toLowerCase()  // fileName toLowerCase
            if (fileName) { // if fileName toLowerCase
              fileName = fileName.replace('jpeg', 'jpg')  // fileName replace
            }
          }
        }
      }
      return fileName && mime.list[fileName][mimeType ? mimeType : 'mime']  // return fileName mimeType mimeType
        ? mime.list[fileName][mimeType ? mimeType : 'mime'] // return fileName mimeType mimeType
        : null  // return null
    }
  }
}

module.exports = mime // export mime
