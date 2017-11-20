// @flow
import aggregateByCountry from '../resources/aggregate-by-country.json'
import codes from '../resources/codes.json'

const noDataCodes: Set<string> = new Set(
  Object.keys(codes).filter(code => {
    return !aggregateByCountry[code]
  })
)

export default noDataCodes
