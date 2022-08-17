const xlsx = require('json-as-xlsx') // xlsx import

const makeXLSX = (
  data // make xlsx
) =>
  xlsx(data, {
    // xlsx
    writeOptions: {
      // write options
      type: 'buffer', // type
      bookType: 'xlsx', // book type
    },
  })

const makeSheet = (name, data, columns) => {
  // make sheet
  const sheetData = {
    // sheet data
    sheet: name, // sheet
    columns: columns ? columns : [], // columns
    content: [], // content
  }
  if (data.length > 0) {
    // if data
    if (!columns) {
      // if columns
      for (let x in data[0]) {
        // for data
        sheetData.columns.push({ label: x, value: x }) // columns
      }
    }
    for (let i = 0; i < data.length; i++) {
      // for data
      sheetData.content.push(data[i]) // content
    }
  }
  return sheetData // sheet data
}

module.exports = {
  // export module
  makeSheet, // make sheet
  makeXLSX, // make xlsx
  expressSend: (fileName, sheets, res) => {
    // express send
    res.writeHead(200, {
      // write head
      'Content-Type': 'application/octet-stream', // content type
      'Content-disposition': 'attachment; filename=' + fileName, // content disposition
    })
    res.end(makeXLSX(sheets)) // end
  },
}
