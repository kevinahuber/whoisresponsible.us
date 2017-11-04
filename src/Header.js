// @flow

import React, {Component} from 'react'
import './Header.css'

type Props = {
  primaryName?: string,
  secondaryName?: string,
  hoveredPrimaryName?: string,
  hoveredSecondaryName?: string,
  onPrimaryClick: () => mixed,
  onSecondaryClick: () => mixed,
  isShowingAll: boolean,
  isSortedNegative: boolean
}
export default class Header extends Component<Props> {
  render() {
    const {
      primaryName,
      secondaryName,
      hoveredPrimaryName,
      hoveredSecondaryName,
      onPrimaryClick,
      onSecondaryClick,
      isShowingAll,
      isSortedNegative
    } = this.props

    const primary = hoveredPrimaryName || primaryName
    const secondary = hoveredSecondaryName || secondaryName

    return (
      <div className="header">
        <h1 className="header__title">
          {isShowingAll && isSortedNegative ? (
            'Top Best'
          ) : isShowingAll ? (
            'Top Worst'
          ) : !primary ? (
            'Who is responsible for Climate Change?'
          ) : secondary ? (
            <div>
              <span onClick={onPrimaryClick} className="header__title--primary">
                {primary}
              </span>
              {' or '}
              <span
                onClick={onSecondaryClick}
                className="header__title--secondary"
              >
                {secondary}
              </span>
            </div>
          ) : (
            <span onClick={onPrimaryClick} className="header__title--primary">
              {primary}
            </span>
          )}
        </h1>
      </div>
    )
  }
}
