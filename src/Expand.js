// @flow

import React, {Component} from 'react'
import expand from './expand.svg'
import './Expand.css'

type Props = {
  onClick: () => mixed
}

export default class Expand extends Component<Props> {
  render () {
    const {
      onClick
    } = this.props

    return (
      <div onClick={onClick} className='expand'>
        <img className='expand__image' alt='expand' src={expand} />
      </div>
    )
  }
}
