// @flow
export type Category = {
  title: string,
  subcategories: string[],
  paris?: boolean
}

export type Geography = {
  properties: {
    name_long: string,
    iso_a3: string
  }
}
