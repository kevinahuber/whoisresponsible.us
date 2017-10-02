// @flow
import React, { Component } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
  // $FlowFixMe
} from 'react-simple-maps'
// import chroma from 'chroma-js'
// $FlowFixMe
import {topology} from 'topojson-server'
// $FlowFixMe
import { scaleLinear } from 'd3-scale'
import Categories from './Categories.js'
import Comparisons from './Comparisons.js'
import Expand from './Expand.js'

import type {Category, Subcategory, Geography as GeographyType} from './types.js' // eslint-disable-line

// TODO: Move to it's own file.
// TODO: BETTER: Bind to map data
import vulnerabilities from './resources/vulnerabilities/vulnerabilities.json'
import capacity from './resources/vulnerabilities/capacity.json'
import ecosystem from './resources/vulnerabilities/ecosystem.json'
import social from './resources/readiness/social.json'
import readiness from './resources/readiness/readiness.json'
import governance from './resources/readiness/governance.json'
import economic from './resources/readiness/economic.json'
import exposure from './resources/vulnerabilities/exposure.json'
import food from './resources/vulnerabilities/food.json'
import health from './resources/vulnerabilities/health.json'
import infrastructure from './resources/vulnerabilities/infrastructure.json'
import sensitivity from './resources/vulnerabilities/sensitivity.json'
import habitat from './resources/vulnerabilities/habitat.json'
import water from './resources/vulnerabilities/water.json'
import contributions from './resources/contributions.json'
import './App.css'
const wrapperStyles = {
  width: '100%',
  maxWidth: 980,
  margin: '0 auto'
}

const categories: Category[] = [
  {
    title: 'Vulnerability',
    data: vulnerabilities,
    subcategories: [
      {
        title: 'Capacity',
        data: capacity
      },
      {
        title: 'Ecosystem',
        data: ecosystem
      },
      {
        title: 'Exposure',
        data: exposure
      },
      {
        title: 'Food',
        data: food
      },
      {
        title: 'Habitat',
        data: habitat
      },
      {
        title: 'Health',
        data: health
      },
      {
        title: 'Infrastructure',
        data: infrastructure
      },
      {
        title: 'Sensitivity',
        data: sensitivity
      },
      {
        title: 'Water',
        data: water
      }
    ]
  },
  {
    title: 'Preparedness',
    data: readiness,
    subcategories: [
      {
        title: 'Economics',
        data: economic
      },
      {
        title: 'Governance',
        data: governance
      },
      {
        title: 'Social',
        data: social
      }
    ]
  },
  {
    title: 'Contribution',
    data: contributions,
    subcategories: [
      {
        title: 'Energy'
      },
      {
        title: 'Industrial'
      },
      {
        title: 'Agriculture'
      },
      {
        title: 'Waste'
      },
      {
        title: 'Land-Use'
      },
      {
        title: 'Bunker Fuels'
      }
    ]
  }
]

const excludes = [
  'ATA'
  // 'GRL'

]
const year = '2015'
// const totalContributions = contributions.reduce((m, c) => {
//   return m + c[year]
// }, 0)

const subcategories: Subcategory[] = categories.reduce((m, c) => {
  return m.concat(c.subcategories)
}, [])

const popScale = scaleLinear()
  .domain([0, 1])
  .range(['#33343D', '#D8D8D8'])

type State = {
  optimizationDisabled: boolean,
  mainOpen: boolean,
  activeSubcategories: string[],
  activeGeography?: GeographyType
}

export default class App extends Component<{}, State> {
  state = { // eslint-disable-line
    optimizationDisabled: false,
    mainOpen: true,
    activeSubcategories: [],
    activeGeography: undefined
  }

  handleCategoryClick = (category: Category) => () => { // eslint-disable-line
    const {
      activeSubcategories
    } = this.state
    const newActiveSubcategories = category.subcategories.every(s => activeSubcategories.includes(s.title))
      ? activeSubcategories.filter(s => !category.subcategories.find(sc => sc.title === s))
      : activeSubcategories.concat(category.subcategories.map(s => s.title).filter(s => !activeSubcategories.includes(s)))
    this.setState((state: State) => ({
      activeSubcategories: newActiveSubcategories,
      optimizationDisabled: true
    }), () => {
      this.setState((state: State) => ({
        optimizationDisabled: false
      }))
    })
  }

  handleSubcategoryClick = (sub: string) => () => { // eslint-disable-line
    const {
      activeSubcategories
    } = this.state
    const newActiveSubcategories = activeSubcategories.includes(sub) ? this.state.activeSubcategories.filter(s => s !== sub) : this.state.activeSubcategories.concat(sub)
    this.setState((state: State) => ({
      activeSubcategories: newActiveSubcategories,
      optimizationDisabled: true
    }), () => {
      this.setState((state: State) => ({
        optimizationDisabled: false
      }))
    })
  }

  handleMainToggle = () => { // eslint-disable-line
    this.setState({mainOpen: !this.state.mainOpen})
  }

  handleClick = (geography: Geography) => { // eslint-disable-line
    this.setState((state: State) => ({
      activeGeography: geography,
      optimizationDisabled: true
    }), () => {
      this.setState((state: State) => ({
        optimizationDisabled: false
      }))
    })
  }

  handleClearGeography = () => { // eslint-disable-line
    this.setState((state: State) => ({
      activeGeography: undefined,
      optimizationDisabled: true
    }), () => {
      this.setState((state: State) => ({
        optimizationDisabled: false
      }))
    })
  }

  getScale = (geography: Geography) => { // eslint-disable-line
    const {
      activeSubcategories
    } = this.state

    if (activeSubcategories && activeSubcategories.length) {
      let noData = false
      const scale = activeSubcategories.reduce((m, sc) => {
        const sub = subcategories.find(s => s.title === sc)
        if (!sub || !sub.data) {
          noData = true
          return m
        }
        return m + (sub.data.find(v => v.ISO3 === geography.properties.iso_a3) || {})[year] || 0
      }, 0) / activeSubcategories.length
      return noData ? null : scale
    }
    return null
  }

  render () {
    const {
      activeSubcategories,
      activeGeography,
      optimizationDisabled
    } = this.state

    let center = [0, 0]
    let zoom = 1

    const height = 699
    const width = 959
    if (activeGeography) {
      const {bbox} = topology(activeGeography)
      center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2]
      zoom = 2.5
      // TODO: FIGURE IT OUT
      const area = ((bbox[2] - bbox[0]) * (bbox[3] - bbox[1]))
      zoom = area / height * width
    }
    const wrapperStyles = {
      width: "100%",
      maxWidth: 980,
      margin: "0 auto",
    }
    console.log(center, zoom)
    return (
      <div className='app'>
        <div onClick={this.handleMainToggle}>
          <h1 className='app__title'>
            {activeGeography ? activeGeography.properties.name_long : 'Who is responsible for Climate Change?'}
          </h1>
        </div>

        <div style={wrapperStyles}>
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
                disableOptimization={optimizationDisabled}
                >
                {(geographies, projection) =>
                  geographies.map((geography, i) => {
                    if (excludes.includes(geography.properties.iso_a3)) return null
                    if (activeGeography && geography.properties.iso_a3 !== activeGeography.properties.iso_a3) return null
                    const scale = this.getScale(geography)
                    if (typeof scale !== 'number' && !!activeSubcategories.length) return null

                    return (
                      <Geography
                        key={i}
                        id={geography.properties.iso_a3}
                        geography={geography}
                        projection={projection}
                        onClick={this.handleClick}
                        style={{
                          default: {
                            fill: popScale(scale),
                            outline: 'none'
                          },
                          hover: {
                            fill: '#F73F0A',
                            strokeWidth: 1.5,
                            zIndex: 1,
                            outline: 'none'
                          },
                          pressed: {
                            stroke: '#F73F0A',
                            fill: popScale(scale),
                            strokeWidth: 1.5,
                            zIndex: 1,
                            outline: 'none'
                          }
                        }}
                      />
                    )
                  }
                )}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          {activeGeography && <Expand onClick={this.handleClearGeography} />}
          {activeGeography && !!activeSubcategories.length && (
            <Comparisons
              subcategories={subcategories}
              activeSubcategories={activeSubcategories}
              activeCode={activeGeography.properties.iso_a3}
              year={year}
            />
          )}
        </div>
        <Categories
          onCategoryClick={this.handleCategoryClick}
          onSubcategoryClick={this.handleSubcategoryClick}
          categories={categories}
          activeSubcategories={activeSubcategories}
        />
      </div>
    )
  }
}
