// @flow
import React, {Component} from 'react'
import './styles.css'
import {DuelComparisons, TopComparisons} from './components'

type Props = {
  activeSubcategories: string[],
  isShowingAll: boolean,
  isShowingParis: boolean,
  isSortedNegative: boolean,
  onTopSort: () => mixed,
  primaryCode: string,
  secondaryCode: string
}

export default class Comparisons extends Component<Props> {
  render() {
    const {
      activeSubcategories,
      isShowingAll,
      isShowingParis,
      isSortedNegative,
      onTopSort,
      primaryCode,
      secondaryCode
    } = this.props

    return (
      <div className="comparisons">
        {isShowingAll ? (
          <TopComparisons
            activeSubcategories={activeSubcategories}
            isShowingParis={isShowingParis}
            isSortedNegative={isSortedNegative}
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
