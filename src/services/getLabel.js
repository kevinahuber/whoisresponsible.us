// @flow

export default (scale: number, isIndex: boolean) => {
  return isIndex
    ? (Math.abs(scale) * 100).toFixed(1)
    : `${Math.abs(scale).toFixed(1)}t per capita`
}
