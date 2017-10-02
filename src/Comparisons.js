// @flow
import React, {Component} from 'react'
import './Comparisons.css'
import type {Subcategory} from './types.js'

type Props = {
  subcategories: Subcategory[],
  activeSubcategories: string[],
  activeCode: string,
  year: string
}

export default class Comparisons extends Component<Props> {
  renderBar (scale: number, title: string) {
    return (
      <div className='comparisons__row'>
        <div className='comparisons__row-title'>{title}</div>
        <div className='comparisons__row-bar'>
          <div className='comparisons__row-bar-bar' style={{
            width: `${scale * 100}%`
          }}>
            <span className='comparisons__row-bar-value'>{`${Math.round(scale * 100)}%`}</span>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const {
      subcategories,
      activeSubcategories,
      activeCode,
      year
    } = this.props

    return (
      <div className='comparisons'>
        {activeSubcategories.map(as => {
          const subcategory = subcategories.find(s => s.title === as)
          if (!subcategory || !subcategory.data) return null
          const scale = (subcategory.data.find(d => d.ISO3 === activeCode) || {})[year] || 0
          return this.renderBar(scale, subcategory.title)
        })}
      </div>
    )
  }
}
