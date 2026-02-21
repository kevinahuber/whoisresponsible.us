import React, { Component } from 'react'
import { connect } from 'react-redux'
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

import mapData from './world-50m-with-population.json'
import { Motion, spring } from 'react-motion'
import getScale from '../../services/getScale.js'
import { actions as tooltipActions } from '../../tooltip'

import { scalePow } from 'd3-scale'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../constants'

import './styles.scss'

const excludedCodes = new Set(['ATA'])

const ZOOM = 2

const popScale = (scale, activeSubcategory) => {
  return scalePow()
    .domain(negativeSubcategories.has(activeSubcategory) ? [1, 0] : [0, 1])
    .range([PRIMARY_COLOR, SECONDARY_COLOR])(scale)
}

class Map extends Component {
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
    this.setState({ canHover })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.activeSubcategory !== nextProps.activeSubcategory ||
      this.props.primaryCode !== nextProps.primaryCode ||
      this.props.secondaryCode !== nextProps.secondaryCode ||
      this.props.isShowingAll !== nextProps.isShowingAll
    ) {
      this.setState({ isOptimizationDisabled: true })
    }

    if (
      !(this.props.primaryCode && this.props.secondaryCode) &&
      nextProps.primaryCode &&
      nextProps.secondaryCode
    )
      this.setState({ center: [0, 0], zoom: 1 })
  }

  componentDidUpdate(prevProps) {
    if (this.state.isOptimizationDisabled) {
      this.setState(() => ({ isOptimizationDisabled: false }))
    }
  }

  // geography is captured via closure from the render loop
  handleMove = (geography, evt) => {
    const x = evt.clientX + window.pageXOffset
    const y = evt.clientY + window.pageYOffset

    const {
      isShowingAll,
      secondaryCode,
      primaryCode,
      dispatch,
      activeSubcategory
    } = this.props

    const { iso_a3, name } = geography.properties
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
          (primaryCode === iso_a3 || secondaryCode === iso_a3)
          ? 'Deselect'
          : iso_a3 === primaryCode ? 'Pick a second country' : name
    const tooltipColor = popScale(scale, activeSubcategory)

    dispatch(
      tooltipActions.show({
        origin: { x, y },
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

  handleZoomIn = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    this.setState((state) => ({
      zoom: state.zoom * ZOOM
    }))
  }

  handleZoomOut = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    this.setState((state) => ({
      zoom: Math.max(state.zoom / ZOOM, 1)
    }))
  }

  handleLeave = () => {
    this.props.dispatch(tooltipActions.hide())
  }

  renderZoom = () => {
    const { isShowingAll } = this.props
    return (
      <div className={cn('map__zoom', { 'map__zoom--all': isShowingAll })}>
        <button className="map__zoom-in" onClick={this.handleZoomIn} aria-label="Zoom in">
          +
        </button>
        <button className="map__zoom-out" onClick={this.handleZoomOut} aria-label="Zoom out">
          -
        </button>
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

    const { canHover, zoom, center } = this.state

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
            zoom: spring(zoom, { stiffness: 210, damping: 20 }),
            x: spring(center[0], { stiffness: 210, damping: 20 }),
            y: spring(center[1], { stiffness: 210, damping: 20 })
          }}
        >
          {({ zoom, x, y }) => (
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
              role="img"
              aria-label="World map showing climate change responsibility data by country"
            >
              <ZoomableGroup
                center={[x, y]}
                zoom={zoom}
              >
                <Geographies geography={mapData}>
                  {({ geographies }) =>
                    geographies.map((geography, i) => {
                      const code = geography.properties.iso_a3
                      if (excludedCodes.has(code)) return null

                      let scale

                      if (activeSubcategory)
                        scale = getScale(activeSubcategory, code)

                      const isActive = code === primaryCode
                      const isSecondary = code === secondaryCode
                      const isDataless = noDataCodes.has(code) || scale === null
                      const color = isDataless
                        ? '#33343D'
                        : isShowingAll
                          ? popScale(scale, activeSubcategory)
                          : isActive
                            ? PRIMARY_COLOR
                            : isSecondary ? SECONDARY_COLOR : '#33343D'
                      const hoverColor = isShowingAll
                        ? popScale(scale, activeSubcategory)
                        : isActive
                          ? PRIMARY_COLOR
                          : isSecondary
                            ? SECONDARY_COLOR
                            : primaryCode ? SECONDARY_COLOR : PRIMARY_COLOR
                      const showTooltip = canHover || isShowingAll
                      return (
                        <Geography
                          key={i}
                          id={geography.properties.iso_a3}
                          geography={geography}
                          onClick={
                            isShowingAll || isDataless
                              ? undefined
                              : (evt) => onGeographyClick(geography, evt)
                          }
                          onMouseMove={
                            showTooltip
                              ? (evt) => this.handleMove(geography, evt)
                              : undefined
                          }
                          onMouseLeave={
                            showTooltip ? this.handleLeave : undefined
                          }
                          style={{
                            default: {
                              fill: color,
                              outline: 'none'
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

export default connect()(Map)
