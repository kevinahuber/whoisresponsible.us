// @flow
import aggregateByCountry from '../resources/aggregate-by-country.json'
import categories from '../resources/categories'

export default (activeSubcategories: string[], code: string): number => {
  let negativeCategories = 0
  let includedCategories = 0

  const aggregate = aggregateByCountry[code]

  if (!aggregate) return 0 // TODO: Handle
  const total = categories.reduce((total, category) => {
    const filteredSubcategories = category.subcategories.filter(s =>
      activeSubcategories.includes(s)
    )

    if (!filteredSubcategories.length) return total

    const average =
      filteredSubcategories.reduce(
        (sum, s) => (sum += aggregate[s.toLowerCase()]),
        0
      ) / filteredSubcategories.length
    includedCategories++
    if (category.isNegative) negativeCategories++

    return category.isNegative ? total - average : total + average
  }, 0)
  return (total + negativeCategories) / includedCategories
}
