// @flow
import React, {Component} from 'react'
import './styles.css'
import data from '../../../../resources/aggregate-by-country.json'
import codes from '../../../../resources/codes.json'
import Row from '../Row'

// Import individual to utilize import bundling benefits
import FaChevronDown from 'react-icons/lib/fa/chevron-down'
import FaChevronUp from 'react-icons/lib/fa/chevron-up'
import FaSortAmountAsc from 'react-icons/lib/fa/sort-amount-asc'
import FaSortAmountDesc from 'react-icons/lib/fa/sort-amount-desc'

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

  renderBar(scale: number, title: string) {
    return (
      <div className="top-comparisons__row" key={title}>
        <div className="top-comparisons__row-title">{title}</div>
        <div className="top-comparisons__row-bar">
          <div
            className="top-comparisons__row-bar-active"
            style={{
              width: `${scale * 100}%`
            }}
          >
            <span className="top-comparisons__row-bar-value">{`${(scale * 100
            ).toFixed(1)}`}</span>
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
          return (
            <Row
              key={i}
              primaryScale={country.average}
              title={codes[country.code]}
            />
          )
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
