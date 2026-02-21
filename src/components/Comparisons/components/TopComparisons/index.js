import React, { Component } from 'react'
import './styles.scss'

import codes from '../../../../resources/codes.json'
import Row from '../Row'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import getAllScales from '../../../../services/getAllScales.js'
import { FaChevronDown, FaChevronUp, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'
import { ENTER_DURATION, EXIT_DURATION } from '../../../../constants'

const TIMEOUT = {
  enter: ENTER_DURATION,
  exit: EXIT_DURATION
}

const LIMIT = 5

export default class TopComparisons extends Component {
  state = {
    isExpanded: false
  }

  sortData(a, b) {
    return b.index - a.index
  }

  handleExpandToggle = () => {
    this.setState((state) => ({ isExpanded: !this.state.isExpanded }))
  }

  render() {
    const { activeSubcategory, isSortedNegative, onSort, isVisible } = this.props

    const { isExpanded } = this.state

    const averageCountries = getAllScales(activeSubcategory).filter(
      c => !(c.index !== 0 && !c.index)
    )
    const sortedCountries = isSortedNegative
      ? averageCountries.sort(this.sortData).reverse()
      : averageCountries.sort(this.sortData)
    const visibleCountries = isExpanded
      ? sortedCountries
      : sortedCountries.slice(0, LIMIT)
    return (
      <div className="top-comparisons">
        <button
          className="top-comparisons__toggle-sort"
          onClick={onSort}
          aria-label={isSortedNegative ? 'Sort ascending' : 'Sort descending'}
        >
          {isSortedNegative ? <FaSortAmountDown aria-hidden="true" /> : <FaSortAmountUp aria-hidden="true" />}
        </button>
        <TransitionGroup>
          {isVisible &&
            visibleCountries.map((country, i) => {
              return (
                <CSSTransition
                  unmountOnExit
                  appear
                  key={country.code}
                  timeout={TIMEOUT}
                  classNames="top-comparisons__row-fade"
                >
                  <Row
                    key={i}
                    primaryScale={country.index}
                    title={codes[country.code]}
                    subcategory={activeSubcategory}
                  />
                </CSSTransition>
              )
            })}
        </TransitionGroup>

        <div className="top-comparisons__toggle-expand-container">
          <button
            className="top-comparisons__toggle-expand"
            onClick={this.handleExpandToggle}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Show fewer countries' : 'Show more countries'}
          >
            {isExpanded ? <FaChevronUp aria-hidden="true" /> : <FaChevronDown aria-hidden="true" />}
          </button>
        </div>
      </div>
    )
  }
}
