// @flow
import React, {Component} from 'react'
import './TopComparisons.css'
import data from './resources/aggregate-by-country.json'
import codes from './resources/codes.json'
import {
  FaChevronDown,
  FaChevronUp,
  FaSortAmountAsc,
  FaSortAmountDesc
  // $FlowFixMe
} from 'react-icons/lib/fa'
type Props = {
  activeSubcategories: string[],
  isSortedNegative: boolean,
  onSort: () => mixed
}

type State = {
  isExpanded: boolean
}

export default class TopComparisons extends Component<Props, State> {
  state = {
    isExpanded: false
  }

  renderBar(activeScale: number, title: string) {
    return (
      <div className="top-comparisons__row" key={title}>
        <div className="top-comparisons__row-title">{title}</div>
        <div className="top-comparisons__row-bar">
          <div
            className="top-comparisons__row-bar-active"
            style={{
              width: `${activeScale * 100}%`
            }}
          >
            <span className="top-comparisons__row-bar-value">{`${Math.round(
              activeScale * 100
            )}%`}</span>
          </div>
        </div>
      </div>
    )
  }

  getAveragedSubcategories(activeSubcategories: string[]) {
    return Object.keys(data).reduce((memo, code) => {
      return [].concat(memo, {
        code,
        average:
          activeSubcategories.reduce((m, sc) => {
            return m + data[code][sc.toLowerCase()] || 0
          }, 0) / activeSubcategories.length
      })
    }, [])
  }

  sortData(a: Object, b: Object) {
    return b.average - a.average
  }

  handleExpandToggle = () => {
    this.setState((state: State) => ({isExpanded: !this.state.isExpanded}))
  }

  render() {
    const {activeSubcategories, isSortedNegative, onSort} = this.props

    const {isExpanded} = this.state

    const averageSubcategories = this.getAveragedSubcategories(
      activeSubcategories
    ).sort(this.sortData)
    const sortedSubcategories = isSortedNegative
      ? averageSubcategories.sort(this.sortData).reverse()
      : averageSubcategories.sort(this.sortData)
    const visibleSubcategories = isExpanded
      ? sortedSubcategories
      : sortedSubcategories.slice(0, 10)
    return (
      <div className="top-comparisons">
        <span className="top-comparisons__toggle-sort" onClick={onSort}>
          {isSortedNegative ? <FaSortAmountDesc /> : <FaSortAmountAsc />}
        </span>
        {visibleSubcategories.map((country, i) => {
          return this.renderBar(country.average, codes[country.code])
        })}
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
