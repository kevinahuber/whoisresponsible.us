import React, { Component } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import './styles.scss'
import { ENTER_DURATION, EXIT_DURATION } from '../../../../constants'

const TIMEOUT = {
  enter: ENTER_DURATION,
  exit: EXIT_DURATION
}

export default class Info extends Component {
  state = {
    isExpanded: false
  }

  handleToggleExpanded = () => {
    this.setState((state) => ({ isExpanded: !state.isExpanded }))
  }

  render() {
    const { isExpanded } = this.state
    const { isShowing, delay } = this.props
    return (
      <TransitionGroup>
        {isShowing && (
          <CSSTransition
            classNames="info__fade"
            unmountOnExit
            appear
            timeout={TIMEOUT}
          >
            <div style={{ transitionDelay: `${delay}ms` }} className="info">
              <button
                onClick={this.handleToggleExpanded}
                className="info__label"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Close information panel' : 'Open information panel'}
              >
                {isExpanded ? 'x' : 'i'}
              </button>
              {isExpanded && (
                <div className="info__details">
                  <b>Vulnerability</b> measures a country's exposure,
                  sensitivity and capacity to adapt to the negative effects of
                  climate change. Vulnerability is an index between 0 and 100.
                  <br />
                  <br />
                  <b>Preparedness</b> a country's ability to leverage
                  investments and convert them to adaptation actions.
                  Preparedness is an index between 0 and 100.
                  <br />
                  <br />
                  <b>Contribution</b> is still actively contributing to climate
                  change. Contribution is measured in metric tonnes of green
                  house gases per capita.
                  <br />
                  <br />
                  All data is from 2014.
                  <br />
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://github.com/kevinahuber/whoisresponsible.us#references"
                    className="info__link"
                  >
                    Data Sources
                  </a>
                </div>
              )}
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    )
  }
}
