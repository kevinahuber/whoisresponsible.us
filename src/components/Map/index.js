// @flow
import React, {Component} from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps'
import cn from 'classnames'
import errors from '../../errors.js'
import noDataCodes from '../../services/getNoDataCodes.js'
import negativeSubcategories from '../../services/getNegativeSubcategories.js'
import getLabel from '../../services/getLabel.js'
import categories from '../../resources/categories.json'
// $FlowFixMe
import {Motion, spring} from 'react-motion'
import withRedux from 'next-redux-wrapper'
import {initStore} from '../../store'
import getScale from '../../services/getScale.js'
import {actions as tooltipActions} from '@kevinahuber/redux-tooltip'

import {scalePow} from 'd3-scale'

import type {Geography as GeographyType} from '../../types.js'
import styles from './styles.css'

const excludedCodes = new Set(['ATA'])

const ZOOM = 2

const popScale = (scale: *, activeSubcategory: string) => {
  return scalePow()
    .domain(negativeSubcategories.has(activeSubcategory) ? [1, 0] : [0, 1])
    .range([styles.primary, styles.secondary])(scale)
}

type Props = {
  activeSubcategory: string,
  dispatch: *, // TODO: Properly type
  primaryCode?: string,
  secondaryCode?: string,
  isShowingAll: boolean,
  onGeographyClick: (geography: GeographyType) => mixed
}

type State = {
  canHover: boolean,
  isOptimizationDisabled: boolean,
  zoom: number,
  center: [number, number]
}

class Map extends Component<Props, State> {
  state = {
    canHover: false,
    isOptimizationDisabled: false,
    zoom: 1,
    center: [0, 0],
    isPanning: false
  }

  componentDidMount() {
    const canHover =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: hover)').matches
    this.setState({canHover})
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.activeSubcategory !== nextProps.activeSubcategory ||
      this.props.primaryCode !== nextProps.primaryCode ||
      this.props.secondaryCode !== nextProps.secondaryCode ||
      this.props.isShowingAll !== nextProps.isShowingAll
    ) {
      this.setState({isOptimizationDisabled: true})
    }

    if (
      !(this.props.primaryCode && this.props.secondaryCode) &&
      nextProps.primaryCode &&
      nextProps.secondaryCode
    )
      this.setState({center: [0, 0], zoom: 1})
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.isOptimizationDisabled) {
      this.setState((state: State) => ({isOptimizationDisabled: false}))
    }
  }

  handleMove = (geography: Geography, evt: window.Event) => {
    const x = evt.clientX + window.pageXOffset
    const y = evt.clientY + window.pageYOffset

    const {
      isShowingAll,
      secondaryCode,
      primaryCode,
      dispatch,
      activeSubcategory
    } = this.props

    const {properties: {iso_a3, name}} = geography
    const scale = getScale(activeSubcategory, iso_a3)
    const category = categories.find(c =>
      c.subcategories.includes(activeSubcategory)
    )
    const isDataless =
      noDataCodes.has(iso_a3) || scale === errors.INVALID_COUNTRY
    const content = isDataless
      ? `${name}: No Data Available`
      : isShowingAll && typeof scale === 'number'
        ? `${name}: ${getLabel(scale, category.isIndex)}`
        : primaryCode &&
          secondaryCode &&
          (primaryCode === iso_a3 || secondaryCode === iso_a3) // eslint-disable-line camelcase
          ? 'Deselect'
          : iso_a3 === primaryCode ? 'Pick a second country' : name // eslint-disable-line camelcase
    const tooltipColor = popScale(scale, activeSubcategory)

    dispatch(
      tooltipActions.show({
        origin: {x, y},
        content,
        contentStyles: {
          color: isShowingAll && !isDataless ? tooltipColor : null
        },
        baseStyles: {
          borderColor: isShowingAll && !isDataless ? tooltipColor : null
        }
      })
    )
  }

  handleZoomIn = (evt: window.Event) => {
    evt.preventDefault()
    evt.stopPropagation()

    this.setState((state: State) => ({
      zoom: state.zoom * ZOOM
    }))
  }

  handleZoomOut = (evt: window.Event) => {
    evt.preventDefault()
    evt.stopPropagation()
    this.setState((state: State) => ({
      zoom: Math.max(state.zoom / ZOOM, 1)
    }))
  }

  handleLeave = () => {
    this.props.dispatch(tooltipActions.hide())
  }

  renderZoom = () => {
    const {isShowingAll} = this.props
    return (
      <div className={cn('map__zoom', {'map__zoom--all': isShowingAll})}>
        <div className="map__zoom-in" onClick={this.handleZoomIn}>
          +
        </div>
        <div className="map__zoom-out" onClick={this.handleZoomOut}>
          -
        </div>
      </div>
    )
  }

  render() {
    const {
      primaryCode,
      secondaryCode,
      activeSubcategory,
      isShowingAll,
      onGeographyClick
    } = this.props

    const {canHover, isOptimizationDisabled, zoom, center} = this.state

    const height = 634
    const width = 959

    return (
      <div
        className={cn('map', {
          'map--collapsed': primaryCode && secondaryCode,
          'map--zoomed': zoom >= ZOOM,
          'map--all': isShowingAll
        })}
        onDoubleClick={zoom === ZOOM ? this.handleZoomOut : this.handleZoomIn}
      >
        {' '}
        <Motion
          defaultStyle={{
            zoom: 1,
            x: 0,
            y: 20
          }}
          style={{
            zoom: spring(zoom, {stiffness: 210, damping: 20}),
            x: spring(center[0], {stiffness: 210, damping: 20}),
            y: spring(center[1], {stiffness: 210, damping: 20})
          }}
        >
          {({zoom, x, y}) => (
            <ComposableMap
              projectionConfig={{
                scale: 200,
                rotation: [-10, 0, 0]
              }}
              width={width}
              height={height}
              style={{
                width: '100%',
                height: 'auto'
              }}
            >
              <ZoomableGroup
                center={[x, y]}
                zoom={zoom}
                disablePanning={zoom === 1}
              >
                <Geographies
                  geographyUrl={'/world-50m-with-population.json'}
                  disableOptimization={isOptimizationDisabled}
                >
                  {(geographies, projection) =>
                    geographies.map((geography, i) => {
                      const code = geography.properties.iso_a3
                      if (excludedCodes.has(code)) return null

                      let scale

                      if (activeSubcategory)
                        scale = getScale(activeSubcategory, code)

                      const isActive = code === primaryCode
                      const isSecondary = code === secondaryCode
                      const isDataless = noDataCodes.has(code) || scale === null
                      // TODO: Import colors from css
                      const color = isDataless
                        ? '#33343D'
                        : isShowingAll
                          ? popScale(scale, activeSubcategory)
                          : isActive
                            ? styles.primary
                            : isSecondary ? styles.secondary : '#33343D'
                      const hoverColor = isShowingAll
                        ? popScale(scale, activeSubcategory)
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
                          onClick={
                            isShowingAll || isDataless ? null : onGeographyClick
                          }
                          onMouseMove={
                            canHover || isShowingAll ? this.handleMove : null
                          }
                          onMouseLeave={
                            canHover || isShowingAll ? this.handleLeave : null
                          }
                          style={{
                            default: {
                              fill: color,
                              outline: 'none',
                              right: -10,
                              left: -10,
                              top: -10,
                              bottom: -10,
                              position: 'absolute'
                            },
                            hover: {
                              fill: hoverColor,
                              outline: 'none',
                              cursor:
                                isShowingAll || isDataless
                                  ? 'default'
                                  : 'pointer'
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
          )}
        </Motion>
        {!(primaryCode && secondaryCode) || isShowingAll
          ? this.renderZoom()
          : null}
      </div>
    )
  }
}

export default withRedux(initStore)(Map)
