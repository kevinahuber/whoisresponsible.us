import React, { Component } from 'react'
import { connect } from 'react-redux'

const SHOW = '@tooltip/SHOW'
const HIDE = '@tooltip/HIDE'

export const actions = {
  show: (payload) => ({ type: SHOW, payload }),
  hide: () => ({ type: HIDE })
}

const initialState = {
  active: false,
  origin: { x: 0, y: 0 },
  content: '',
  contentStyles: {},
  baseStyles: {}
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW:
      return { ...state, active: true, ...action.payload }
    case HIDE:
      return { ...state, active: false }
    default:
      return state
  }
}

class TooltipBase extends Component {
  render() {
    const { active, origin, content, contentStyles, baseStyles, className } = this.props
    if (!active) return null

    const containerStyle = {
      position: 'absolute',
      left: origin.x + 10,
      top: origin.y - 40,
      pointerEvents: 'none',
      zIndex: 1000,
      ...baseStyles
    }

    return (
      <div className={className} style={containerStyle} role="tooltip">
        <div className={`${className}-content`} style={contentStyles}>
          {content}
        </div>
        <div className={`${className}-arrow`} aria-hidden="true">
          <span />
        </div>
      </div>
    )
  }
}

export const Tooltip = connect((state) => state.tooltip)(TooltipBase)
