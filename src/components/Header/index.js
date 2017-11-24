// @flow

import React, {Component} from 'react'
import './styles.css'

type Props = {
  primaryName?: string,
  secondaryName?: string,
  onPrimaryClick: () => mixed,
  onSecondaryClick: () => mixed,
  isShowingAll: boolean,
  activeSubcategory?: string
}
export default class Header extends Component<Props> {
  render() {
    const {
      primaryName,
      secondaryName,
      onPrimaryClick,
      onSecondaryClick,
      isShowingAll,
      activeSubcategory
    } = this.props

    return (
      <header className="header">
        <h1 className="header__title">
          {isShowingAll ? (
            activeSubcategory
          ) : !primaryName ? (
            'Who is responsible for Climate Change?'
          ) : secondaryName ? (
            <div>
              <span onClick={onPrimaryClick} className="header__title--primary">
                {primaryName}
              </span>
              {' or '}
              <span
                onClick={onSecondaryClick}
                className="header__title--secondary"
              >
                {secondaryName}
              </span>
            </div>
          ) : (
            <span onClick={onPrimaryClick} className="header__title--primary">
              {primaryName}
            </span>
          )}
        </h1>
      </header>
    )
  }
}
