// @flow

import React, {Component} from 'react'
import './styles.css'
import categories from '../../resources/categories.json'
import cn from 'classnames'
type Props = {
  onBackClick: () => mixed,
  onAllToggle: () => mixed,
  isShowingAll: boolean,
  activeSubcategory: string
}

export default class Controls extends Component<Props> {
  renderLegend = () => {
    const {activeSubcategory} = this.props
    const activeCategory =
      categories.find(c => c.subcategories.includes(activeSubcategory)) || {}
    return (
      <div className="controls__legend">
        <div className="controls__legend-gradient">
          <span className="controls__legend-label controls__legend-label--first">
            {activeCategory.lowLabel}
          </span>
          <span className="controls__legend-label">
            {activeCategory.highLabel}
          </span>
        </div>
      </div>
    )
  }

  render() {
    const {onBackClick, onAllToggle, isShowingAll} = this.props

    return (
      <div className={cn('controls', {'controls--all': isShowingAll})}>
        {isShowingAll && this.renderLegend()}
        <div
          onClick={isShowingAll ? onAllToggle : onBackClick}
          className="controls__back"
        >
          <span className="controls__label">{'< Back'}</span>
        </div>
        {!isShowingAll && (
          <div onClick={onAllToggle} className="controls__all">
            <span className="controls__label">See how everyone stacks up</span>
          </div>
        )}
      </div>
    )
  }
}
