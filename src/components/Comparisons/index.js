import React, { Component } from 'react'
import './styles.scss'
import { DuelComparisons, TopComparisons } from './components'

export default class Comparisons extends Component {
  render() {
    const {
      activeSubcategories,
      activeSubcategory,
      isShowingAll,
      isShowingParis,
      isSortedNegative,
      isVisible,
      onTopSort,
      primaryCode,
      secondaryCode
    } = this.props

    return (
      <div className={isVisible ? 'comparisons' : ''}>
        {isShowingAll ? (
          <TopComparisons
            activeSubcategory={activeSubcategory}
            isShowingParis={isShowingParis}
            isSortedNegative={isSortedNegative}
            isVisible={isVisible}
            onSort={onTopSort}
          />
        ) : (
          <DuelComparisons
            activeSubcategories={activeSubcategories}
            isShowingParis={isShowingParis}
            primaryCode={primaryCode}
            secondaryCode={secondaryCode}
          />
        )}
      </div>
    )
  }
}
