const jsonfile = require('jsonfile')
const codes = require('./archive/aggregate-by-country.json')
const file = 'src/resources/aggregate-by-country.json'

const obj = Object.keys(codes).reduce((o, c) => {
  let country = codes[c]
  if (!Object.keys(country).reduce((s, k) => s + k, 0)) {
    console.log(c)
    country = Object.keys(country).reduce(
      (co, p) => Object.assign({}, co, {[p]: null}),
      {}
    )
  }
  return Object.assign({}, o, {[c]: country})
}, {})

jsonfile.writeFile(file, obj, console.error)
