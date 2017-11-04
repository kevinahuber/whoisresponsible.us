// @flow
import React, { Component } from "react";
import "./Comparisons.css";
import data from "./resources/aggregate-by-country.json";

type Props = {
  activeSubcategories: string[],
  activeCode: string,
  secondaryCode: string
};

export default class Comparisons extends Component<Props> {
  renderBar(activeScale: number, secondaryScale: number, title: string) {
    console.log(activeScale);
    return (
      <div className="comparisons__row" key={title}>
        <div className="comparisons__row-title">{title}</div>
        <div className="comparisons__row-bar">
          <div
            className="comparisons__row-bar-active"
            style={{
              width: `${(activeScale || 0) * 100}%`
            }}
          >
            <span className="comparisons__row-bar-value">{`${Math.round(
              activeScale * 100
            )}%`}</span>
          </div>
          <div
            className="comparisons__row-bar-bar comparisons__row-bar-secondary"
            style={{
              width: `${(secondaryScale || 0) * 100}%`
            }}
          >
            <span className="comparisons__row-bar-value">{`${Math.round(
              secondaryScale * 100
            )}%`}</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { activeSubcategories, activeCode, secondaryCode } = this.props;

    return (
      <div className="comparisons">
        {activeSubcategories.map(as => {
          const activeScale = data[activeCode]
            ? data[activeCode][as.toLowerCase()]
            : 0;
          const secondaryScale = data[secondaryCode]
            ? data[secondaryCode][as.toLowerCase()]
            : 0;

          return this.renderBar(activeScale, secondaryScale, as);
        })}
      </div>
    );
  }
}
