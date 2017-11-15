// @flow
import React from 'react'
import './styles.css'
import cn from 'classnames'
type BarProps = {
  primaryScale: number,
  secondaryScale?: number,
  isNegative?: boolean
}

const Bar = ({primaryScale, secondaryScale, isNegative}: BarProps) => (
  <div className={cn('row__bar', {'row__bar--negative': isNegative})}>
    {(isNegative ? primaryScale < 0 : primaryScale > 0) && (
      <div
        className="row__bar-primary"
        style={{
          width: `${Math.abs(primaryScale || 0) * 100}%`
        }}
      >
        <span className="row__bar-value">{`${(primaryScale * 100).toFixed(
          1
        )}`}</span>
      </div>
    )}
    {typeof secondaryScale === 'number' &&
      (isNegative ? secondaryScale < 0 : secondaryScale > 0) && (
        <div
          className="row__bar-bar row__bar-secondary"
          style={{
            width: `${Math.abs(secondaryScale || 0) * 100}%`
          }}
        >
          <span className="row__bar-value">{`${(secondaryScale * 100).toFixed(
            1
          )}`}</span>
        </div>
      )}
  </div>
)

type Props = {
  primaryScale: number,
  secondaryScale?: number,
  title: string,
  isNegative?: boolean,
  hasNegative?: boolean
}

const Row = ({
  primaryScale,
  secondaryScale,
  title,
  isNegative,
  hasNegative
}: Props) => (
  <div className={cn('row', {'row--negative': hasNegative})} key={title}>
    {hasNegative && (
      <Bar
        primaryScale={isNegative ? primaryScale * -1 : primaryScale}
        secondaryScale={
          isNegative ? (secondaryScale || 0) * -1 : secondaryScale
        }
        isNegative
      />
    )}
    <div className="row__title">{title}</div>
    <Bar
      primaryScale={isNegative ? primaryScale * -1 : primaryScale}
      secondaryScale={isNegative ? (secondaryScale || 0) * -1 : secondaryScale}
    />
  </div>
)

export default Row
