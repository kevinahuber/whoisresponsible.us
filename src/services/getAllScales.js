// @flow
import aggregateByCountry from '../resources/aggregate-by-country.json'
import getScale from './getScale.js'
export default (
  activeSubcategories: string[]
): {code: string, index: number}[] => {
  return Object.keys(aggregateByCountry).reduce((memo, code) => {
    return [].concat(memo, {
      code,
      index: getScale(activeSubcategories, code)
    })
  }, [])
}
