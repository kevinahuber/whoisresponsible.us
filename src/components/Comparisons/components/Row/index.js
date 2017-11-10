// @flow
import React from 'react'
import './styles.css'
type Props = {
  primaryScale: number,
  secondaryScale?: number,
  title: string
}
const Row = ({primaryScale, secondaryScale, title}: Props) => (
  <div className="row" key={title}>
    <div className="row__title">{title}</div>
    <div className="row__bar">
      <div
        className="row__bar-primary"
        style={{
          width: `${(primaryScale || 0) * 100}%`
        }}
      >
        <span className="row__bar-value">{`${(primaryScale * 100).toFixed(
          1
        )}`}</span>
      </div>
      {typeof secondaryScale === 'number' && (
        <div
          className="row__bar-bar row__bar-secondary"
          style={{
            width: `${(secondaryScale || 0) * 100}%`
          }}
        >
          <span className="row__bar-value">{`${(secondaryScale * 100).toFixed(
            1
          )}`}</span>
        </div>
      )}
    </div>
  </div>
)

export default Row
