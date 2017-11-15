import React, {Component} from 'react'
import './styles.css'

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="footer__container">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://medium.com/@kevinahuber/climate-change-responsibility-wip-84cdcb9aa2cd"
            className="footer__responsibility-link"
          >
            Who is responsible for this data?
          </a>
          <span className="footer__attribution">
            {'Developed & Designed with ♥  by '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="footer__attribution-link"
              href="https://www.behance.net/csweetdesigns"
            >
              Claire Sweet
            </a>
            {' and '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="footer__attribution-link"
              href="https://kevinahuber.com"
            >
              Kevin A. Huber
            </a>
          </span>
        </div>
      </div>
    )
  }
}
