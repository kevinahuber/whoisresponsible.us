import categories from '../resources/categories.json'

const negativeSubcategories = new Set(
  categories.reduce((m, c) => {
    if (c.isNegative) return m.concat(c.subcategories)
    return m
  }, [])
)

export default negativeSubcategories
