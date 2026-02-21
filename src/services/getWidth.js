import maxes from '../resources/maxes.json'

export default (subcategory, scale, isIndex) => {
  return isIndex
    ? Math.abs(scale) * 100
    : Math.abs(scale / maxes[subcategory]) * 100
}
