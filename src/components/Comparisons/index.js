// @flow
import React, {Component} from 'react'
import './styles.css'
import {DuelComparisons} from './components'

type Props = {
  activeSubcategories: string[],
  activeSubcategory: string,
  isShowingParis: boolean,
  isVisible: boolean,
  primaryCode: string,
  secondaryCode: string,
  onColumnClick: (sub: string) => () => mixed
}

export default class Comparisons extends Component<Props> {
  render() {
    const {
      activeSubcategories,
      isShowingParis,
      isVisible,
      primaryCode,
      secondaryCode,
      onColumnClick
    } = this.props

    return (
      <div className={isVisible ? 'comparisons' : ''}>
        <DuelComparisons
          onColumnClick={onColumnClick}
          activeSubcategories={activeSubcategories}
          isShowingParis={isShowingParis}
          primaryCode={primaryCode}
          secondaryCode={secondaryCode}
        />
      </div>
    )
  }
}
