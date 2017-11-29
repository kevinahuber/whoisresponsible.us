// @flow
import React, {Component} from 'react'

import {
  Categories,
  Comparisons,
  Controls,
  Footer,
  Header,
  Map
} from '../../components'

import withRedux from 'next-redux-wrapper'
import {initStore} from '../../store'
// TODO: Abstract into component
import {Tooltip, actions as tooltipActions} from '@kevinahuber/redux-tooltip'
import type {Geography, Category} from '../../types.js'

import './styles.css'

const LIMIT = Infinity

type State = {
  activeSubcategories: string[],
  activeSubcategory?: string,
  isShowingAll: boolean,
  isShowingParis: boolean,
  primaryGeography?: Geography,
  secondaryGeography?: Geography,
  clicktime: Date,
  tooltipColor?: string
}

type Props = {
  dispatch: *
}

// const testGeography = {
//   properties: {
//     iso_a3: 'USA',
//     name: 'Funland'
//   }
// }

class App extends Component<Props, State> {
  state = {
    activeSubcategories: [],
    activeSubcategory: undefined,
    isPaused: false,
    isShowingAll: false,
    isShowingParis: false,
    isSortedNegative: false,
    primaryGeography: undefined,
    secondaryGeography: undefined,
    clicktime: new Date(),
    tooltipColor: undefined
  }

  handleCategoryClick = (category: Category) => () => {
    const {isShowingAll} = this.state

    if (isShowingAll) return
    this.setState((state: State) => {
      const {activeSubcategories} = state
      const newActiveSubcategories = category.subcategories.every(s =>
        activeSubcategories.includes(s)
      )
        ? activeSubcategories.filter(
            s => !category.subcategories.find(sc => sc === s)
          )
        : category.subcategories
            .map(s => s)
            .filter(s => !activeSubcategories.includes(s))
            .concat(activeSubcategories)
      return {activeSubcategories: newActiveSubcategories}
    })
  }

  handleSubcategoryClick = (sub: string) => () => {
    this.props.dispatch(tooltipActions.hide())
    return this.setState({activeSubcategory: sub, isShowingAll: true})
  }

  handleGeographyClick = (geography: Geography, evt: window.Event) => {
    evt.stopPropagation()
    const newState = {}

    if (this.state.primaryGeography) {
      if (
        geography.properties.iso_a3 ===
        this.state.primaryGeography.properties.iso_a3
      ) {
        newState.primaryGeography = undefined
      } else if (
        this.state.secondaryGeography &&
        geography.properties.iso_a3 ===
          this.state.secondaryGeography.properties.iso_a3
      ) {
        newState.secondaryGeography = undefined
      } else {
        newState.secondaryGeography = geography
      }
    } else {
      newState.primaryGeography = geography
    }
    const x = evt.clientX + window.pageXOffset
    const y = evt.clientY + window.pageYOffset

    this.setState(
      (state: State) => newState,
      () => {
        if (this.state.primaryGeography && this.state.secondaryGeography) {
          this.props.dispatch(tooltipActions.hide())
        } else {
          this.props.dispatch(
            tooltipActions.show({
              origin: {x, y},
              content: 'Pick a second country'
            })
          )
        }
      }
    )
  }

  handleClearGeography = () => {
    this.setState({
      primaryGeography: undefined,
      secondaryGeography: undefined,
      isShowingAll: false
    })
  }

  handleAllToggle = () => {
    this.setState((state: State) => ({
      activeSubcategory:
        state.activeSubcategory ||
        state.activeSubcategories[state.activeSubcategories.length - 1],
      isShowingAll: !state.isShowingAll
    }))
  }

  handlePrimaryClick = () => {
    this.setState({
      primaryGeography: undefined
    })
  }

  handleSecondaryClick = () => {
    this.setState({
      secondaryGeography: undefined
    })
  }

  handleParisClick = () => {
    this.setState((state: State) => ({
      isShowingParis: !state.isShowingParis
    }))
  }

  render() {
    const {
      activeSubcategories,
      activeSubcategory,
      isShowingAll,
      isShowingParis,
      primaryGeography,
      secondaryGeography
    } = this.state

    return (
      <div className="app">
        <Tooltip
          className={
            isShowingAll
              ? 'app__tooltip--all'
              : !primaryGeography
                ? 'app__tooltip--primary'
                : 'app__tooltip--secondary'
          }
        />
        <Header
          primaryName={primaryGeography && primaryGeography.properties.name}
          secondaryName={
            secondaryGeography && secondaryGeography.properties.name
          }
          isShowingAll={isShowingAll}
          activeSubcategory={activeSubcategory}
          onPrimaryClick={this.handlePrimaryClick}
          onSecondaryClick={this.handleSecondaryClick}
        />
        <div className="app__body">
          <div className="app__container">
            <Map
              onGeographyClick={this.handleGeographyClick}
              activeSubcategories={activeSubcategories}
              activeSubcategory={activeSubcategory}
              primaryCode={
                primaryGeography
                  ? primaryGeography.properties.iso_a3
                  : undefined
              }
              secondaryCode={
                secondaryGeography
                  ? secondaryGeography.properties.iso_a3
                  : undefined
              }
              isShowingAll={isShowingAll}
            />
            {primaryGeography &&
              secondaryGeography && (
                <Controls
                  activeSubcategory={activeSubcategory}
                  onBackClick={this.handleClearGeography}
                  onAllToggle={this.handleAllToggle}
                  isShowingAll={isShowingAll}
                  hasActiveSubcategories={!!activeSubcategories.length}
                />
              )}
            <Categories
              primaryCode={
                primaryGeography
                  ? primaryGeography.properties.iso_a3
                  : undefined
              }
              secondaryCode={
                secondaryGeography
                  ? secondaryGeography.properties.iso_a3
                  : undefined
              }
              onCategoryClick={this.handleCategoryClick}
              onSubcategoryClick={this.handleSubcategoryClick}
              onParisClick={this.handleParisClick}
              activeSubcategories={activeSubcategories}
              activeSubcategory={activeSubcategory}
              isShowingParis={isShowingParis}
              isShowingAll={isShowingAll}
              isShowing={primaryGeography && secondaryGeography && isShowingAll}
            />
          </div>

          {primaryGeography &&
            secondaryGeography &&
            !isShowingAll && (
              <Comparisons
                onColumnClick={this.handleSubcategoryClick}
                activeSubcategory={activeSubcategory}
                activeSubcategories={activeSubcategories}
                primaryCode={primaryGeography.properties.iso_a3}
                secondaryCode={secondaryGeography.properties.iso_a3}
                isShowingAll={isShowingAll}
                isShowingParis={isShowingParis}
                isVisible
              />
            )}
        </div>
        <Footer />
      </div>
    )
  }
}

export default withRedux(initStore)(App)
