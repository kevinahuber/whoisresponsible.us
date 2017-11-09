// @flow
import React, {Component} from 'react'
import './styles.css'
import data from '../../../../resources/aggregate-by-country.json'

type Props = {
  primaryCode: string,
  activeSubcategories: string[],
  isShowingParis: boolean,
  secondaryCode: string
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
  renderBar(primaryScale: number, secondaryScale: number, title: string) {
    return (
      <div className="duel-comparisons__row" key={title}>
        <div className="duel-comparisons__row-title">{title}</div>
        <div className="duel-comparisons__row-bar">
          <div
            className="duel-comparisons__row-bar-primary"
            style={{
              width: `${(primaryScale || 0) * 100}%`
            }}
          >
            <span className="duel-comparisons__row-bar-value">{`${(primaryScale *
              100
            ).toFixed(1)}`}</span>
          </div>
          <div
            className="duel-comparisons__row-bar-bar duel-comparisons__row-bar-secondary"
            style={{
              width: `${(secondaryScale || 0) * 100}%`
            }}
          >
            <span className="duel-comparisons__row-bar-value">{`${(secondaryScale *
              100
            ).toFixed(1)}`}</span>
          </div>
        </div>
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
        {activeSubcategories.map(as => {
          const primaryScale = data[primaryCode]
            ? data[primaryCode][as.toLowerCase()]
            : 0
          const secondaryScale = data[secondaryCode]
            ? data[secondaryCode][as.toLowerCase()]
            : 0

          return this.renderBar(primaryScale, secondaryScale, as)
        })}
      </div>
    )
  }
}
