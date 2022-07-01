let keywords = {} // keywords

const languages = {   // languages
  english: require('../messages/languages/english'),  // english
  spanish: require('../messages/languages/spanish'),  // spanish
  arabic: require('../messages/languages/arabic') // arabic
}

for (let x in languages) {  // for
  for (let y in languages[x].keywords) {  // for
    if (!keywords[y]) { // if
      keywords[y] = []  // keywords
    }
    keywords[y] = [...keywords[y], ...languages[x].keywords[y]] // keywords
  }
}

module.exports = searchText => {  // export module
  let keyword = null  // keyword
  if (searchText.length > 0) {  // if
    for (let x in keywords) { // for
      if (!keyword && keywords[x].includes(searchText.toLowerCase())) { // if
        keyword = x // keyword
      } 
    }
  }
  return keyword  // return keyword
}
