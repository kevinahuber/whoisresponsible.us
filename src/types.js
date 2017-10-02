// @flow

export type Subcategory = {
  title: string,
  data?: any // TODO: Explicitly type
}

export type Category = {
  title: string,
  data: any, // TODO: Explicitly type
  subcategories: Subcategory[]
}

export type Geography = Object
