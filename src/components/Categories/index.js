// @flow
import React, {Component} from 'react'
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import data from '../../resources/aggregate-by-country.json'

import styles from './styles.css'
import type {Category as CategoryType} from '../../types.js'
import Info from './components/Info'
import cn from 'classnames'
import categories from '../../resources/categories.json'

const TIMEOUT = {
  enter: parseInt(styles.enter, 10),
  exit: parseInt(styles.exit, 10)
}

const formatLabel = (value: number): string => {
  return (value * 100).toFixed(1)
}
type SubcategoryValueProps = {
  subcategory: string,
  primaryCode: string,
  secondaryCode: string
}
// TODO: Come up with a much better way to handle mobile than duplicating work
const SubcategoryValue = ({
  subcategory,
  primaryCode,
  secondaryCode
}: SubcategoryValueProps) => {
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

type SubcategoryProps = {
  activeSubcategories: string[],
  activeSubcategory?: string,
  isShowingAll?: boolean,
  onSubcategoryClick: (title: string) => mixed,
  subcategory: string,
  index: number,
  primaryCode: string,
  secondaryCode: string
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
}: SubcategoryProps) => {
  const isActive = activeSubcategories.includes(subcategory)
  return (
    <div
      className={cn('categories__subcategory', {
        'categories__subcategory--all': isShowingAll
      })}
      key={index}
    >
      <div
        className={cn('categories__subcategory-title', {
          'categories__subcategory-title--active': isShowingAll
            ? activeSubcategory === subcategory
            : isActive
        })}
        onClick={onSubcategoryClick(subcategory)}
      >
        {subcategory}
      </div>
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

type CategoryProps = {
  activeSubcategories: string[],
  activeSubcategory?: string,
  isShowingAll: boolean,
  onSubcategoryClick: (title: string) => mixed,
  category: CategoryType,
  isShowingParis: boolean,
  delay: number,
  onCategoryClick: (category: CategoryType) => mixed,
  onParisClick: () => mixed,
  primaryCode: string,
  secondaryCode: string
}

const Category = ({
  category,
  isShowingParis,
  onCategoryClick,
  onParisClick,
  delay,
  ...subcategoryProps
}: CategoryProps) => {
  return (
    <div
      style={{transitionDelay: `${delay}ms`}}
      className="categories__category"
    >
      <div className="categories__category-container">
        <div
          className="categories__category-title"
          onClick={onCategoryClick(category)}
        >
          {category.title}
        </div>
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
        <div
          onClick={onParisClick}
          className={cn('categories__paris', {
            'categories__paris--active': isShowingParis
          })}
        >
          Paris Accord
        </div>
      )}
    </div>
  )
}

type Props = {
  activeSubcategories: string[],
  activeSubcategory?: string,
  onSubcategoryClick: (title: string) => mixed,
  isShowing: boolean,
  isShowingParis: boolean,
  isShowingAll: boolean,
  onCategoryClick: (category: CategoryType) => mixed,
  onParisClick: () => mixed,
  primaryCode?: string,
  secondaryCode?: string
}

type State = {
  isExiting: boolean[]
}

export default class Categories extends Component<Props, State> {
  state = {
    isExiting: []
  }

  handleExit = (index: number) => () => {
    this.setState((state: State) => {
      const isExiting = state.isExiting.slice()
      isExiting[index] = true
      return {isExiting}
    })
  }

  handleExited = (index: number) => () => {
    this.setState((state: State) => {
      const isExiting = state.isExiting.slice()
      isExiting[index] = false
      return {isExiting}
    })
  }

  render() {
    const {isShowing, ...categoryProps} = this.props
    const {isExiting} = this.state
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
