// @flow
import aggregateByCountry from '../resources/aggregate-by-country.json'
import getScale from './getScale.js'
import errors from '../errors.js'
export default (
  activeSubcategory: string
): {code: string, index: number | $Values<typeof errors>}[] => {
  return Object.keys(aggregateByCountry).reduce((memo, code) => {
    return [].concat(memo, {
      code,
      index: getScale(activeSubcategory, code)
    })
  }, [])
}
