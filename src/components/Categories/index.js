import React, { Component } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import data from '../../resources/aggregate-by-country.json'

import './styles.scss'
import Info from './components/Info'
import cn from 'classnames'
import categories from '../../resources/categories.json'
import { ENTER_DURATION, EXIT_DURATION } from '../../constants'

const TIMEOUT = {
  enter: ENTER_DURATION,
  exit: EXIT_DURATION
}

const formatLabel = (value) => {
  return (value * 100).toFixed(1)
}

const SubcategoryValue = ({
  subcategory,
  primaryCode,
  secondaryCode
}) => {
  const activeCategory = categories.find(c =>
    c.subcategories.includes(subcategory)
  )
  const isNegative = (activeCategory || {}).isNegative
  const primaryScale = data[primaryCode]
    ? data[primaryCode][subcategory.toLowerCase()]
    : 0
  const secondaryScale = data[secondaryCode]
    ? data[secondaryCode][subcategory.toLowerCase()]
    : 0

  return (
    <div className="categories__subcategory-value">
      <div className="categories__subcategory-value--primary">
        {formatLabel(isNegative ? primaryScale * -1 : primaryScale)}
      </div>
      <div className="categories__subcategory-value--secondary">
        {formatLabel(isNegative ? secondaryScale * -1 : secondaryScale)}
      </div>
    </div>
  )
}

const Subcategory = ({
  activeSubcategories,
  activeSubcategory,
  isShowingAll,
  onSubcategoryClick,
  primaryCode,
  secondaryCode,
  subcategory,
  index
}) => {
  const isActive = activeSubcategories.includes(subcategory)
  return (
    <div
      className={cn('categories__subcategory', {
        'categories__subcategory--all': isShowingAll
      })}
      key={index}
    >
      <button
        className={cn('categories__subcategory-title', {
          'categories__subcategory-title--active': isShowingAll
            ? activeSubcategory === subcategory
            : isActive
        })}
        onClick={onSubcategoryClick(subcategory)}
      >
        {subcategory}
      </button>
      {isActive &&
        !isShowingAll &&
        primaryCode &&
        secondaryCode && (
          <SubcategoryValue
            primaryCode={primaryCode}
            secondaryCode={secondaryCode}
            subcategory={subcategory}
          />
        )}
    </div>
  )
}

const Category = ({
  category,
  isShowingParis,
  onCategoryClick,
  onParisClick,
  delay,
  ...subcategoryProps
}) => {
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className="categories__category"
    >
      <div className="categories__category-container">
        <button
          className="categories__category-title"
          onClick={onCategoryClick(category)}
        >
          {category.title}
        </button>
        {category.subcategories &&
          category.subcategories.map((subcategory, i) => (
            <Subcategory
              key={i}
              subcategory={subcategory}
              index={i}
              {...subcategoryProps}
            />
          ))}
      </div>
      {category.paris && (
        <button
          onClick={onParisClick}
          className={cn('categories__paris', {
            'categories__paris--active': isShowingParis
          })}
        >
          Paris Accord
        </button>
      )}
    </div>
  )
}

export default class Categories extends Component {
  state = {
    isExiting: []
  }

  handleExit = (index) => () => {
    this.setState((state) => {
      const isExiting = state.isExiting.slice()
      isExiting[index] = true
      return { isExiting }
    })
  }

  handleExited = (index) => () => {
    this.setState((state) => {
      const isExiting = state.isExiting.slice()
      isExiting[index] = false
      return { isExiting }
    })
  }

  render() {
    const { isShowing, ...categoryProps } = this.props
    const { isExiting } = this.state
    return (
      <div
        className={cn('categories', {
          'categories--all': categoryProps.isShowingAll,
          'categories--showing': isShowing
        })}
      >
        <Info isShowing={isShowing} delay={isExiting[2] ? 50 : 0} />
        <TransitionGroup className="categories__container">
          {isShowing &&
            categories.map((category, i) => {
              const delay = isExiting[i] ? i * 50 : (2 - i) * 50
              return (
                <CSSTransition
                  unmountOnExit
                  appear
                  onEntered={this.handleExit(i)}
                  onExited={this.handleExited(i)}
                  key={i}
                  timeout={TIMEOUT}
                  classNames="categories__category-fade"
                >
                  <Category
                    category={category}
                    delay={delay}
                    {...categoryProps}
                  />
                </CSSTransition>
              )
            })}
        </TransitionGroup>
      </div>
    )
  }
}
