import React, { Component } from 'react'
import './Footer.css'

export default class Footer extends Component {
  render () {
    return (
      <div className='footer'>
        <div className='footer__container'>
          <a href='https://needlink.com' className='footer__responsibility-link'>
            Who is responsible for this data?
          </a>
          <span className='footer__attribution'>
            {'Developed & Designed with ♥  by '}
            <a className='footer__attribution-link' href='https://www.behance.net/csweetdesigns'>Claire Sweet</a>
            {' and '}
            <a className='footer__attribution-link' href='https://kevinahuber.com'>Kevin A. Huber</a>
          </span>
        </div>
      </div>
    )
  }
}
