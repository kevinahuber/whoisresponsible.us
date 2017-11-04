const jsonfile = require('jsonfile')
const contributions = require('../src/resources/archive/contribution/total-with-code.json')
const file = 'percent-with-code-cleaned.json'

const names = {
  Energy: 'Energy',
  'Industrial Processes': 'Industrial',
  Agriculture: 'Agriculture',
  Waste: 'Waste',
  'Bunker Fuels': 'Bunker Fuels',
  'Land-Use Change and Forestry': 'Land-Use'
}

const defaultMaxes = Object.keys(names).reduce(
  (m, n) => Object.assign({}, m, {[n]: 0}),
  {}
)

const maxes = contributions.reduce((m, c) => {
  return Object.keys(m).reduce((me, n) => {
    return Object.assign({}, me, {[n]: Math.max(m[n] + c[n]}))
  }, {})
}, defaultTotals)

console.log(totals)
const obj = contributions.map(c => {
  return Object.assign(
    {},
    {
      code: c.code
    },
    Object.keys(names).reduce((m, t) => {
      return Object.assign({}, m, {[names[t]]: (c[t] || 0) / totals[t]})
    }, {})
  )
})

jsonfile.writeFile(file, obj, console.error)
