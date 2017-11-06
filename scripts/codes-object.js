const jsonfile = require('jsonfile')
const codes = require('../src/resources/archive/codes.json')
const file = 'src/resources/codes.json'
const obj = codes.reduce((m, t) => {
  return Object.assign({}, m, {
    [t.code]: t.country
  })
}, {})

jsonfile.writeFile(file, obj, console.error)
