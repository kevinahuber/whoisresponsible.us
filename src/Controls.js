// @flow

import React, {Component} from 'react'
import './Controls.css'

type Props = {
  onBackClick: () => mixed,
  onAllToggle: () => mixed,
  isShowingAll: boolean,
  hasActiveSubcategories: boolean
}

export default class Controls extends Component<Props> {
  render () {
    const {
      onBackClick,
      onAllToggle,
      isShowingAll,
      hasActiveSubcategories
    } = this.props

    return (
      <div className='controls'>
        <div onClick={isShowingAll ? onAllToggle : onBackClick} className='controls__back'>
          <span className='controls__label'>
            {'< Back'}
          </span>
        </div>
        {!isShowingAll && hasActiveSubcategories && <div onClick={onAllToggle} className='controls__all'>
          <span className='controls__label'>
            See how everyone stacks up
          </span>
        </div>}
      </div>
    )
  }
}
