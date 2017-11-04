// @flow
import React, {Component} from 'react'
import './Info.css'

type State = {
  isShowing: boolean
}
export default class Info extends Component<{}, State> {
  state = {
    isShowing: false
  }

  handleToggleShow = () => {
    this.setState((state: State) => ({isShowing: !state.isShowing}))
  }
  render() {
    const {isShowing} = this.state
    return (
      <div className="info">
        <div onClick={this.handleToggleShow} className="info__label">
          {isShowing ? 'x' : 'i'}
        </div>
        {isShowing && (
          <div className="info__details">
            <b>Vulnerability</b> is the exposure a nation has to climate change.
            <br />
            <br />
            <b>Preparedness</b> is the ability for a nation to respond.
            <br />
            <br />
            <b>Contribution</b> is the amount of damage a nation has done to the
            climate.
            <br />
            <br />
            In all categories, the higher the number, the worse off.
            <br />
            <br />
            All data is from 2014.
          </div>
        )}
      </div>
    )
  }
}
