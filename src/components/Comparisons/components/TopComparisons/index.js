// @flow
import React, {Component} from 'react'
import styles from './styles.css'

import codes from '../../../../resources/codes.json'
import Row from '../Row'
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import getAllScales from '../../../../services/getAllScales.js'
// Import individual to utilize import bundling benefits
import FaChevronDown from 'react-icons/lib/fa/chevron-down'
import FaChevronUp from 'react-icons/lib/fa/chevron-up'
import FaSortAmountAsc from 'react-icons/lib/fa/sort-amount-asc'
import FaSortAmountDesc from 'react-icons/lib/fa/sort-amount-desc'

const TIMEOUT = {
  enter: parseInt(styles.enter, 10),
  exit: parseInt(styles.exit, 10)
}
type Props = {
  activeSubcategories: string[],
  isSortedNegative: boolean,
  isVisible: boolean,
  onSort: () => mixed
}

type State = {
  isExpanded: boolean
}

const LIMIT = 5

export default class TopComparisons extends Component<Props, State> {
  state = {
    isExpanded: false
  }

  sortData(a: Object, b: Object) {
    return b.index - a.index
  }

  handleExpandToggle = () => {
    this.setState((state: State) => ({isExpanded: !this.state.isExpanded}))
  }

  render() {
    const {
      activeSubcategories,
      isSortedNegative,
      onSort,
      isVisible
    } = this.props

    const {isExpanded} = this.state

    const averageSubcategories = getAllScales(activeSubcategories)
    const sortedSubcategories = isSortedNegative
      ? averageSubcategories.sort(this.sortData).reverse()
      : averageSubcategories.sort(this.sortData)
    const visibleSubcategories = isExpanded
      ? sortedSubcategories
      : sortedSubcategories.slice(0, LIMIT)
    return (
      <div className="top-comparisons">
        <span className="top-comparisons__toggle-sort" onClick={onSort}>
          {isSortedNegative ? <FaSortAmountDesc /> : <FaSortAmountAsc />}
        </span>
        <TransitionGroup>
          {isVisible &&
            visibleSubcategories.map((country, i) => {
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
                  />
                </CSSTransition>
              )
            })}
        </TransitionGroup>

        <div className="top-comparisons__toggle-expand-container">
          <span
            className="top-comparisons__toggle-expand"
            onClick={this.handleExpandToggle}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
      </div>
    )
  }
}
