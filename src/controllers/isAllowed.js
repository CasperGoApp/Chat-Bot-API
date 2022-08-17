const PHONES_ALLOWED = [
  // allowed phones
  '50685168778',
  '+50685168778',
]

module.exports = (number) => {
  // export module
  //Only enable responses for allowed Phone Numbers
  return PHONES_ALLOWED.includes(number && number.id ? number.id : number)
}
