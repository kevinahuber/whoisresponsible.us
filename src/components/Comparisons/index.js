// @flow
import React, {Component} from 'react'
import './styles.css'
import {DuelComparisons, TopComparisons} from './components'

type Props = {
  activeSubcategories: string[],
  activeCode: string,
  secondaryCode: string,
  isShowingAll: boolean,
  isSortedNegative: boolean,
  onTopSort: () => mixed
}

export default class Comparisons extends Component<Props> {
  render() {
    const {
      activeSubcategories,
      activeCode,
      secondaryCode,
      isShowingAll,
      isSortedNegative,
      onTopSort
    } = this.props

    return (
      <div className="comparisons">
        {isShowingAll ? (
          <TopComparisons
            activeSubcategories={activeSubcategories}
            onSort={onTopSort}
            isSortedNegative={isSortedNegative}
          />
        ) : (
          <DuelComparisons
            activeSubcategories={activeSubcategories}
            activeCode={activeCode}
            secondaryCode={secondaryCode}
          />
        )}
      </div>
    )
  }
}
