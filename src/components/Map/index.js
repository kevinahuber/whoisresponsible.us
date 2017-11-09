// @flow
import React, {Component} from 'react'
import {ComposableMap, Geographies, Geography} from 'react-simple-maps'
import cn from 'classnames'

import {scaleLinear} from 'd3-scale'

import type {Geography as GeographyType} from '../../types.js'

import data from '../../resources/aggregate-by-country.json'
import styles from './styles.css'

const excludes = [
  'ATA'
  // 'GRL'
]

const popScale = scaleLinear()
  .domain([0, 1])
  .range(['#33343D', '#D8D8D8'])

type Props = {
  activeSubcategories: string[],
  primaryCode?: string,
  secondaryCode?: string,
  isShowingAll: boolean,
  onGeographyClick: (geography: GeographyType) => mixed,
  onGeographyMouseEnter: (geography: GeographyType) => mixed
}

type State = {
  canHover: boolean,
  isOptimizationDisabled: boolean
}

export default class Map extends Component<Props, State> {
  state = {
    canHover: false,
    isOptimizationDisabled: false
  }

  componentDidMount() {
    const canHover =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover)').matches
    this.setState((state: State) => ({canHover}))
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.activeSubcategories.length !==
        nextProps.activeSubcategories.length ||
      this.props.primaryCode !== nextProps.primaryCode ||
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
      primaryCode,
      secondaryCode,
      isShowingAll,
      onGeographyClick,
      onGeographyMouseEnter
    } = this.props

    const {canHover, isOptimizationDisabled} = this.state

    const height = 630
    const width = 959

    return (
      <div
        className={cn('map', {
          'map--collapsed': primaryCode && secondaryCode
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
                  if (typeof scale !== 'number' && !!activeSubcategories.length)
                    return null
                }

                const isActive = code === primaryCode
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
                      : primaryCode ? styles.secondary : styles.primary
                return (
                  <Geography
                    key={i}
                    id={geography.properties.iso_a3}
                    geography={geography}
                    projection={projection}
                    onClick={onGeographyClick}
                    onMouseEnter={canHover ? onGeographyMouseEnter : undefined}
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
        </ComposableMap>
      </div>
    )
  }
}
