const jsonfile = require('jsonfile')
const contributions = require('./archive/contribution/total-with-code.json')
const file = './scripts/archive/contribution/index-with-code-cleaned.json'

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
    return Object.assign({}, me, {[n]: Math.max(m[n], c[n])})
  }, {})
}, defaultMaxes)

console.log(maxes)
const obj = contributions.map(c => {
  return Object.assign(
    {},
    {
      code: c.code
    },
    Object.keys(names).reduce((m, t) => {
      return Object.assign({}, m, {
        [names[t]]: typeof c[t] === 'number' ? c[t] / maxes[t] : null
      })
    }, {})
  )
})

jsonfile.writeFile(file, obj, console.error)
