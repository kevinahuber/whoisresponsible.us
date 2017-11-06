// @flow

import React, {Component} from 'react'
import './styles.css'
import type {Category} from '../../types.js'
import Info from './components/Info'
import cn from 'classnames'

const categories: Category[] = [
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
    ]
  }
]

type Props = {
  activeSubcategories: string[],
  onCategoryClick: (category: Category) => mixed,
  onSubcategoryClick: (title: string) => mixed
}

export default class Categories extends Component<Props> {
  render() {
    const {
      activeSubcategories,
      onSubcategoryClick,
      onCategoryClick
    } = this.props

    return (
      <div className="categories">
        <Info />
        <div className="categories__container">
          {categories.map((category, i) => {
            return (
              <div className="categories__category" key={i}>
                <div
                  className="categories__category-title"
                  onClick={onCategoryClick(category)}
                >
                  {category.title}
                </div>
                {category.subcategories &&
                  category.subcategories.map((s, i) => (
                    <div
                      key={i}
                      className={cn('categories__subcategory-title', {
                        'categories__subcategory-title--active': activeSubcategories.includes(
                          s
                        )
                      })}
                      onClick={onSubcategoryClick(s)}
                    >
                      {s}
                    </div>
                  ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
