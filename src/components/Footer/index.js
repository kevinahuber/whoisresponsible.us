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
            href="https://github.com/kevinahuber/whoisresponsible.us#references"
            className="footer__responsibility-link"
          >
            Who is responsible for this data?
          </a>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://medium.com/@kevinahuber/who-is-responsible-for-climate-change-84cdcb9aa2cd"
            className="footer__responsibility-link"
          >
            Learn More
          </a>

          <span className="footer__attribution">
            {'Developed & Designed with ♥  by '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="footer__attribution-link"
              href="https://kevinahuber.com"
            >
              Kevin A. Huber
            </a>
            {' & '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="footer__attribution-link"
              href="https://www.behance.net/csweetdesigns"
            >
              Claire Sweet
            </a>
          </span>
        </div>
      </div>
    )
  }
}
