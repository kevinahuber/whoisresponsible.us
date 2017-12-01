const jsonfile = require('jsonfile')
const contributions = require('./archive/contribution/total-with-code.json')
const file = './scripts/archive/contribution/index-with-code-cleaned.json'

const names = {
  'Energy Per Capita (tCO2e Per Capita)': 'Energy',
  'Industrial Processes Per Capita (tCO2e Per Capita)': 'Industrial',
  'Agriculture Per Capita (tCO2e Per Capita)': 'Agriculture',
  'Waste Per Capita (tCO2e Per Capita)': 'Waste',
  'Bunker Fuels Per Capita (tCO2 Per Capita)': 'Bunker Fuels',
  'Land-Use Change and Forestry Per Capita (tCO2 Per Capita)': 'Land-Use'
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
