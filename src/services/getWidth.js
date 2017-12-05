// @flow
import maxes from '../resources/maxes.json'

export default (subcategory: string, scale: number, isIndex: boolean) => {
  return isIndex
    ? Math.abs(scale) * 100
    : Math.abs(scale / maxes[subcategory]) * 100
}
