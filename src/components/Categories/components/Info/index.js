// @flow
import React, {Component} from 'react'
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import styles from './styles.css'

const TIMEOUT = {
  enter: parseInt(styles.enter, 10),
  exit: parseInt(styles.exit, 10)
}

type Props = {
  isShowing: boolean,
  delay: number
}
type State = {
  isExpanded: boolean
}

export default class Info extends Component<Props, State> {
  state = {
    isExpanded: false
  }

  handleToggleExpanded = () => {
    this.setState((state: State) => ({isExpanded: !state.isExpanded}))
  }

  render() {
    const {isExpanded} = this.state
    const {isShowing, delay} = this.props
    return (
      <TransitionGroup>
        {isShowing && (
          <CSSTransition
            classNames="info__fade"
            unmountOnExit
            appear
            timeout={TIMEOUT}
          >
            <div style={{transitionDelay: `${delay}ms`}} className="info">
              <div onClick={this.handleToggleExpanded} className="info__label">
                {isExpanded ? 'x' : 'i'}
              </div>
              {isExpanded && (
                <div className="info__details">
                  <b>Vulnerability</b> is the exposure a country has to climate
                  change.
                  <br />
                  <br />
                  <b>Preparedness</b> is the ability for a country to respond.
                  <br />
                  <br />
                  <b>Contribution</b> is the amount of damage a country has done
                  to the climate.
                  <br />
                  <br />
                  In all categories, the higher the number, the worse off.
                  <br />
                  <br />
                  All data is from 2014.
                </div>
              )}
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    )
  }
}
