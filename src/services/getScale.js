// @flow
import aggregateByCountry from '../resources/aggregate-by-country.json'
import errors from '../errors.js'

// TODO: Switch to only accounting for single sub
export default (
  activeSubcategory: string,
  code: string
): number | 'INVALID_COUNTRY' | 'INVALID_SUBCATEGORY' => {
  if (!activeSubcategory) return errors.INVALID_SUBCATEGORY
  const country = aggregateByCountry[code]

  if (!country) return errors.INVALID_COUNTRY

  return country[activeSubcategory.toLowerCase()]
}
