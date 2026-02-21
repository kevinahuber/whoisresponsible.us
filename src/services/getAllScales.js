import aggregateByCountry from '../resources/aggregate-by-country.json'
import getScale from './getScale.js'

export default (activeSubcategory) => {
  return Object.keys(aggregateByCountry).reduce((memo, code) => {
    return [].concat(memo, {
      code,
      index: getScale(activeSubcategory, code)
    })
  }, [])
}
