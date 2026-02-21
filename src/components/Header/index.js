import React, { Component } from 'react'
import './styles.scss'

export default class Header extends Component {
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
              <button onClick={onPrimaryClick} className="header__title--primary">
                {primaryName}
              </button>
              {' or '}
              <button
                onClick={onSecondaryClick}
                className="header__title--secondary"
              >
                {secondaryName}
              </button>
            </div>
          ) : (
            <button onClick={onPrimaryClick} className="header__title--primary">
              {primaryName}
            </button>
          )}
        </h1>
      </header>
    )
  }
}
