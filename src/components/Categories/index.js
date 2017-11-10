// @flow
import React, {Component} from 'react'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

import styles from './styles.css'
import type {Category as CategoryType} from '../../types.js'
import Info from './components/Info'
import cn from 'classnames'

const TIMEOUT = {
  enter: parseInt(styles.enter, 10),
  exit: parseInt(styles.exit, 10)
}
const categories: CategoryType[] = [
  {
    title: 'Vulnerability',
    subcategories: [
      'Capacity',
      'Ecosystem',
      'Exposure',
      'Food',
      'Habitat',
      'Health',
      'Infrastructure',
      'Sensitivity',
      'Water'
    ]
  },
  {
    title: 'Preparedness',
    subcategories: ['Economic', 'Governance', 'Social']
  },
  {
    title: 'Contribution',
    subcategories: [
      'Energy',
      'Industrial',
      'Agriculture',
      'Waste',
      'Land-Use',
      'Bunker Fuels'
    ],
    paris: false
  }
]

type SubcategoryProps = {
  activeSubcategories: string[],
  onSubcategoryClick: (title: string) => mixed,
  subcategory: string,
  index: number
}

const Subcategory = ({
  activeSubcategories,
  onSubcategoryClick,
  subcategory,
  index
}: SubcategoryProps) => (
  <div
    key={index}
    className={cn('categories__subcategory-title', {
      'categories__subcategory-title--active': activeSubcategories.includes(
        subcategory
      )
    })}
    onClick={onSubcategoryClick(subcategory)}
  >
    {subcategory}
  </div>
)

type CategoryProps = {
  activeSubcategories: string[],
  onSubcategoryClick: (title: string) => mixed,
  category: CategoryType,
  isShowingParis: boolean,
  delay: number,
  onCategoryClick: (category: CategoryType) => mixed,
  onParisClick: () => mixed
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
  onSubcategoryClick: (title: string) => mixed,
  isShowing: boolean,
  isShowingParis: boolean,
  onCategoryClick: (category: CategoryType) => mixed,
  onParisClick: () => mixed
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
      <div className="categories">
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
