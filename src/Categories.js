// @flow

import React, {Component} from 'react'
import './Categories.css'
import type {Category} from './types.js'

type Props = {
  activeSubcategories: string[],
  categories: Category[],
  onCategoryClick: (category: Category) => mixed,
  onSubcategoryClick: (title: string) => mixed
}

export default class Categories extends Component<Props> {
  render () {
    const {
      categories,
      activeSubcategories,
      onSubcategoryClick,
      onCategoryClick
    } = this.props

    return (
      <div className='categories'>
        {categories.map((category, i) => {
          return (
            <div className='categories__category' key={i}>
              <div className='categories__category-title' onClick={onCategoryClick(category)} >
                {category.title}
              </div>
              {category.subcategories && category.subcategories.map((s, i) => (
                <div
                  key={i}
                  className={`categories__subcategory-title ${activeSubcategories.includes(s.title) ? 'categories__subcategory-title--active' : ''}`}
                  onClick={onSubcategoryClick(s.title)}>
                  {s.title}
                </div>
            ))}
            </div>
          )
        })}
      </div>
    )
  }
}
