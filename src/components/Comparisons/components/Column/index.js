// @flow
import React, {Component} from 'react'
import './styles.css'
import cn from 'classnames'

import withRedux from 'next-redux-wrapper'
import {initStore} from '../../../../store'
import {actions as tooltipActions} from '@kevinahuber/redux-tooltip'

type Props = {
  primaryScale: number | null,
  secondaryScale: number | null,
  size: number,
  title: string,
  dispatch: *,
  onClick: (sub: string) => () => mixed
}

type State = {
  canHover: boolean
}
const NoData = _ => <div className="column--no-data" />

class Column extends Component<Props, State> {
  state = {
    canHover: false
  }
  getLabel = (value: number | null) => {
    if (value === null) return 'No Data'
    return (value * 100).toFixed(1)
  }
  handleMove = (primaryScale: number | null, secondaryScale: number | null) => (
    evt: window.Event
  ) => {
    const x = evt.clientX + window.pageXOffset
    const y = evt.clientY + window.pageYOffset
    const {dispatch} = this.props

    const content = (
      <div className="column__label">
        <div className="column__label--primary">
          {this.getLabel(primaryScale)}
        </div>
        <div className="column__label--secondary">
          {this.getLabel(secondaryScale)}
        </div>
      </div>
    )
    dispatch(
      tooltipActions.show({
        origin: {x, y},
        content
      })
    )
  }

  handleLeave = () => {
    this.props.dispatch(tooltipActions.hide())
  }

  componentDidMount() {
    const canHover =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover)').matches
    this.setState({canHover})
  }

  render() {
    const {primaryScale, secondaryScale, title, size, onClick} = this.props
    const {canHover} = this.state
    return (
      <div
        onClick={onClick(title)}
        onMouseMove={
          canHover ? this.handleMove(primaryScale, secondaryScale) : null
        }
        onMouseLeave={canHover ? this.handleLeave : null}
        className="column"
        style={{
          width: `calc(${size}% - 10px)`,
          backgroundSize: `${size * 5}px ${size * 5}px`
        }}
      >
        {primaryScale !== null ? (
          <div
            className={cn('column__primary', {
              'column--negative': primaryScale < 0
            })}
            style={{height: Math.abs(primaryScale) * 50 + '%'}}
          >
            <div className="column__value">{primaryScale}</div>
          </div>
        ) : (
          <NoData />
        )}
        {secondaryScale !== null ? (
          <div
            className={cn('column__secondary', {
              'column--negative': Math.abs(secondaryScale) * 100 + '%'
            })}
          >
            <div className="column__value">{secondaryScale}</div>
          </div>
        ) : (
          <NoData />
        )}
        <div className="column__title">{title}</div>
        <div className="column__dummy">dummy</div>
      </div>
    )
  }
}

export default withRedux(initStore)(Column)
