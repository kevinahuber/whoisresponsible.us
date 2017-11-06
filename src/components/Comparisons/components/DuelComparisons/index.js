// @flow
import React, {Component} from 'react'
import './styles.css'
import data from '../../../../resources/aggregate-by-country.json'

type Props = {
  activeSubcategories: string[],
  activeCode: string,
  secondaryCode: string
}

export default class DuelComparisons extends Component<Props> {
  renderBar(activeScale: number, secondaryScale: number, title: string) {
    return (
      <div className="duel-comparisons__row" key={title}>
        <div className="duel-comparisons__row-title">{title}</div>
        <div className="duel-comparisons__row-bar">
          <div
            className="duel-comparisons__row-bar-active"
            style={{
              width: `${(activeScale || 0) * 100}%`
            }}
          >
            <span className="duel-comparisons__row-bar-value">{`${Math.round(
              activeScale * 100
            )}%`}</span>
          </div>
          <div
            className="duel-comparisons__row-bar-bar duel-comparisons__row-bar-secondary"
            style={{
              width: `${(secondaryScale || 0) * 100}%`
            }}
          >
            <span className="duel-comparisons__row-bar-value">{`${Math.round(
              secondaryScale * 100
            )}%`}</span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {activeSubcategories, activeCode, secondaryCode} = this.props

    return (
      <div className="duel-comparisons">
        {activeSubcategories.map(as => {
          const activeScale = data[activeCode]
            ? data[activeCode][as.toLowerCase()]
            : 0
          const secondaryScale = data[secondaryCode]
            ? data[secondaryCode][as.toLowerCase()]
            : 0

          return this.renderBar(activeScale, secondaryScale, as)
        })}
      </div>
    )
  }
}
