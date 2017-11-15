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
                  <b>Vulnerability</b> measures a country’s exposure,
                  sensitivity and capacity to adapt to the negative effects of
                  climate change.
                  <br />
                  <br />
                  <b>Preparedness</b> a country’s ability to leverage
                  investments and convert them to adaptation actions.
                  <br />
                  <br />
                  <b>Contribution</b> is still actively contributing to climate
                  change.
                  <br />
                  <br />
                  <b>Responsibility Index</b> is a combination of all of the
                  factors, as seen with 'see how everyone stacks up'. Categories
                  that have no factors selected are not considered when
                  calculating the index. The higher the number, the better. In
                  all cases, the further left a candate is, the better.
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
