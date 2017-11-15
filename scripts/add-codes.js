const jsonfile = require('jsonfile')
const contributions = require('./archive/contribution/total.json')
const codes = require('./archive/codes.json')
const file = './scripts/archive/contribution/total-with-code.json'
const obj = contributions.map(t => {
  const country = Object.assign({}, t)
  const code = codes.find(
    c => c.country.toLowerCase() === t.Country.toLowerCase()
  )
  if (!code) console.log('missing', t.Country)
  country.code = (code || {}).code || ''
  return country
})

jsonfile.writeFile(file, obj, console.error)
