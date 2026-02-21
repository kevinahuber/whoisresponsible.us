import aggregateByCountry from '../resources/aggregate-by-country.json'
import errors from '../errors.js'

export default (activeSubcategory, code) => {
  if (!activeSubcategory) return errors.INVALID_SUBCATEGORY
  const country = aggregateByCountry[code]

  if (!country) return errors.INVALID_COUNTRY

  return country[activeSubcategory.toLowerCase()]
}
