// @flow
import React from 'react'
import './styles.css'
import cn from 'classnames'
import categories from '../../../../resources/categories.json'
import {type Errors} from '../../../../errors.js'
import getWidth from '../../../../services/getWidth.js'
import getLabel from '../../../../services/getLabel.js'

type BarProps = {
  primaryScale: number,
  secondaryScale?: number,
  isNegative?: boolean,
  subcategory: string
}

const Bar = ({
  primaryScale,
  secondaryScale,
  isNegative,
  subcategory
}: BarProps) => {
  const category = categories.find(c => c.subcategories.includes(subcategory))

  return (
    <div className={cn('row__bar', {'row__bar--negative': isNegative})}>
      {(isNegative ? primaryScale < 0 : primaryScale > 0) && (
        <div
          className="row__bar-primary"
          style={{
            width: `${getWidth(subcategory, primaryScale, category.isIndex)}%`
          }}
        >
          <span className="row__bar-value">
            {getLabel(primaryScale, category.isIndex)}
          </span>
        </div>
      )}
      {typeof secondaryScale === 'number' &&
        (isNegative ? secondaryScale < 0 : secondaryScale > 0) && (
          <div
            className="row__bar-bar row__bar-secondary"
            style={{
              width: `${getWidth(
                subcategory,
                secondaryScale,
                category.isIndex
              )}%`
            }}
          >
            <span className="row__bar-value">
              {getLabel(secondaryScale, category.isIndex)}
            </span>
          </div>
        )}
    </div>
  )
}

type Props = {
  primaryScale: number | Errors,
  secondaryScale?: number | Errors,
  title: string,
  isNegative?: boolean,
  hasNegative?: boolean,
  subcategory: string
}

const Row = ({
  primaryScale,
  secondaryScale,
  title,
  isNegative,
  hasNegative,
  subcategory
}: Props) => {
  if (
    typeof primaryScale !== 'number' ||
    (secondaryScale && typeof secondaryScale !== 'number')
  )
    return
  return (
    <div className={cn('row', {'row--negative': hasNegative})} key={title}>
      {hasNegative && (
        <Bar
          primaryScale={isNegative ? primaryScale * -1 : primaryScale}
          secondaryScale={
            isNegative ? (secondaryScale || 0) * -1 : secondaryScale
          }
          isNegative
          subcategory={subcategory}
        />
      )}
      <div className="row__title">{title}</div>
      <Bar
        primaryScale={isNegative ? primaryScale * -1 : primaryScale}
        secondaryScale={
          isNegative ? (secondaryScale || 0) * -1 : secondaryScale
        }
        subcategory={subcategory}
      />
    </div>
  )
}

export default Row
