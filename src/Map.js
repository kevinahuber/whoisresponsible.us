// @flow
import React, {Component} from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
  // $FlowFixMe
} from 'react-simple-maps'
// $FlowFixMe
import cn from 'classnames'

// $FlowFixMe
import {scaleLinear} from 'd3-scale'

import type {Geography as GeographyType} from './types.js'

import data from './resources/aggregate-by-country.json'
import styles from './Map.css'

const excludes = [
  'ATA'
  // 'GRL'
]

const popScale = scaleLinear()
  .domain([0, 1])
  .range(['#33343D', '#D8D8D8'])

type Props = {
  activeSubcategories: string[],
  activeCode?: string,
  secondaryCode?: string,
  isShowingAll: boolean,
  onGeographyClick: (geography: GeographyType) => mixed,
  onGeographyMouseEnter: (geography: GeographyType) => mixed,
  onGeographyMouseLeave: (geography: GeographyType) => mixed
}

type State = {
  isOptimizationDisabled: boolean
}

export default class Map extends Component<Props, State> {
  state = {
    isOptimizationDisabled: false
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.activeSubcategories.length !==
        nextProps.activeSubcategories.length ||
      this.props.activeCode !== nextProps.activeCode ||
      this.props.secondaryCode !== nextProps.secondaryCode ||
      this.props.isShowingAll !== nextProps.isShowingAll
    ) {
      this.setState((state: State) => ({isOptimizationDisabled: true}))
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.isOptimizationDisabled) {
      this.setState((state: State) => ({isOptimizationDisabled: false}))
    }
  }

  getScale = (code: string) => {
    const {activeSubcategories} = this.props

    if (!activeSubcategories || !activeSubcategories.length || !data[code])
      return null

    return (
      activeSubcategories.reduce((m, sc) => {
        return m + data[code][sc.toLowerCase()] || 0
      }, 0) / activeSubcategories.length
    )
  }

  render() {
    const {
      activeSubcategories,
      activeCode,
      secondaryCode,
      isShowingAll,
      onGeographyClick,
      onGeographyMouseEnter,
      onGeographyMouseLeave
    } = this.props

    const {isOptimizationDisabled} = this.state
    let center = [0, 10]
    let zoom = 1

    const height = 599
    const width = 959

    return (
      <div
        className={cn('map', {
          'map--collapsed': activeCode && secondaryCode
        })}
      >
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11, 0, 0]
          }}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: 'auto'
          }}
        >
          <ZoomableGroup center={center} zoom={zoom} disablePanning>
            <Geographies
              geographyUrl={'/world-50m-with-population.json'}
              disableOptimization={isOptimizationDisabled}
            >
              {(geographies, projection) =>
                geographies.map((geography, i) => {
                  const code = geography.properties.iso_a3
                  if (excludes.includes(code)) return null

                  let scale
                  if (isShowingAll) {
                    scale = this.getScale(code)
                    if (
                      typeof scale !== 'number' &&
                      !!activeSubcategories.length
                    )
                      return null
                  }

                  const isActive = code === activeCode
                  const isSecondary = code === secondaryCode

                  // TODO: Import colors from css
                  const color = isShowingAll
                    ? popScale(scale)
                    : isActive
                      ? styles.primary
                      : isSecondary ? styles.secondary : '#33343D'
                  const hoverColor = isShowingAll
                    ? popScale(scale)
                    : isActive
                      ? styles.primary
                      : isSecondary
                        ? styles.secondary
                        : activeCode ? styles.secondary : styles.primary
                  return (
                    <Geography
                      key={i}
                      id={geography.properties.iso_a3}
                      geography={geography}
                      projection={projection}
                      onClick={onGeographyClick}
                      onMouseEnter={onGeographyMouseEnter}
                      onMouseLeave={onGeographyMouseLeave}
                      style={{
                        default: {
                          fill: color,
                          outline: 'none'
                        },
                        hover: {
                          fill: hoverColor,
                          outline: 'none',
                          cursor: 'pointer'
                        },
                        pressed: {
                          fill: hoverColor,
                          outline: 'none',
                          opacity: 0.5
                        }
                      }}
                    />
                  )
                })}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}
