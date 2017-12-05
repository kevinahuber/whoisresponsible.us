// @flow

const errors = {
  INVALID_COUNTRY: 'INVALID_COUNTRY',
  INVALID_SUBCATEGORY: 'INVALID_SUBCATEGORY'
}

export type Errors = $Keys<typeof errors>

export default errors
