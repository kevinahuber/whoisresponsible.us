const jsonfile = require('jsonfile')
const fs = require('fs')
const file = 'aggregate-by-country.json'
const readinessFolder = './scripts/archive/readiness'
const vulnerabilitiesFolder = './scripts/archive/vulnerabilities'
const contributions = require('./archive/contribution/index-with-code-cleaned.json')
const year = '2014'
const obj = {}

// HACK: this can all be done a lot more intelligently
function importAndManipulate(folder) {
  fs.readdirSync(folder).forEach(file => {
    const title = file.split('.')[0]
    console.log(title)
    const data = require(`.${folder}/${file}`)

    data.forEach(d => {
      if (!obj[d.ISO3]) obj[d.ISO3] = {}
      obj[d.ISO3][title] = d[year]
    })
  })
}

importAndManipulate(vulnerabilitiesFolder)
importAndManipulate(readinessFolder)
contributions.forEach(d => {
  if (!obj[d.code]) obj[d.code] = {}

  Object.keys(d).forEach(c => {
    if (c === 'code') return
    obj[d.code][c.toLowerCase()] = d[c]
  })
})

jsonfile.writeFile(file, obj, console.error)
