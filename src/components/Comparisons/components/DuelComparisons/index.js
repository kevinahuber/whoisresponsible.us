// @flow
import React, {Component} from 'react'
import data from '../../../../resources/aggregate-by-country.json'
import Column from '../Column'
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import styles from './styles.css'
import categories from '../../../../resources/categories.json'

const TIMEOUT = {
  enter: parseInt(styles.enter, 10),
  exit: parseInt(styles.exit, 10)
}

type Props = {
  primaryCode: string,
  activeSubcategories: string[],
  isShowingParis: boolean,
  secondaryCode: string,
  onColumnClick: (sub: string) => () => mixed
}

export default class DuelComparisons extends Component<Props> {
  renderParis(primaryCode: string, secondaryCode: string) {
    return (
      <div className="duel-comparisons__paris">
        <span className="duel-comparisons__paris-title">Paris Agreement</span>
        <span className="duel-comparisons__paris-primary">
          {data[primaryCode].paris}
        </span>
        <span className="duel-comparisons__paris-secondary">
          {data[secondaryCode].paris}
        </span>
      </div>
    )
  }

  render() {
    const {
      primaryCode,
      isShowingParis,
      secondaryCode,
      onColumnClick
    } = this.props

    const activeSubcategories = categories.reduce(
      (m, c) => m.concat(c.subcategories),
      []
    )

    const size = 100 / activeSubcategories.length
    return (
      <div className="duel-comparisons">
        {isShowingParis && this.renderParis(primaryCode, secondaryCode)}
        <TransitionGroup>
          {activeSubcategories.map((as, i) => {
            const primaryScale = data[primaryCode]
              ? data[primaryCode][as.toLowerCase()]
              : 0
            const secondaryScale = data[secondaryCode]
              ? data[secondaryCode][as.toLowerCase()]
              : 0

            const activeCategory = categories.find(c =>
              c.subcategories.includes(as)
            )
            const isNegative = (activeCategory || {}).isNegative
            return (
              <CSSTransition
                unmountOnExit
                appear
                key={as}
                timeout={TIMEOUT}
                classNames="duel-comparisons__row-fade"
              >
                <Column
                  onClick={onColumnClick}
                  primaryScale={isNegative ? primaryScale * -1 : primaryScale}
                  secondaryScale={
                    isNegative ? secondaryScale * -1 : secondaryScale
                  }
                  size={size}
                  title={as}
                />
              </CSSTransition>
            )
          })}
        </TransitionGroup>
      </div>
    )
  }
}
