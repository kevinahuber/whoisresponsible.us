import React, { Component } from 'react'
import data from '../../../../resources/aggregate-by-country.json'
import Row from '../Row'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import './styles.scss'
import categories from '../../../../resources/categories.json'
import { ENTER_DURATION, EXIT_DURATION } from '../../../../constants'

const TIMEOUT = {
  enter: ENTER_DURATION,
  exit: EXIT_DURATION
}

export default class DuelComparisons extends Component {
  renderParis(primaryCode, secondaryCode) {
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
      activeSubcategories,
      isShowingParis,
      secondaryCode
    } = this.props

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
                <Row
                  hasNegative
                  isNegative={isNegative}
                  primaryScale={primaryScale}
                  secondaryScale={secondaryScale}
                  title={as}
                  subcategory={as}
                />
              </CSSTransition>
            )
          })}
        </TransitionGroup>
      </div>
    )
  }
}
