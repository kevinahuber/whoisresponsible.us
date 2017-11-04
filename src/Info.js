// @flow
import React, { Component } from "react";
import "./Info.css";

type State = {
  isShowing: boolean
};
export default class Info extends Component<{}, State> {
  state = {
    isShowing: false
  };

  handleToggleShow = () => {
    this.setState((state: State) => ({ isShowing: !state.isShowing }));
  };
  render() {
    const { isShowing } = this.state;
    return (
      <div className="info">
        <div onClick={this.handleToggleShow} className="info__label">
          {isShowing ? "x" : "i"}
        </div>
        {isShowing && (
          <div className="info__details">
            Lorem Khaled Ipsum is a major key to success. Fan luv. The key is to
            drink coconut, fresh coconut, trust me. Major key, don’t fall for
            the trap, stay focused. It’s the ones closest to you that want to
            see you fail. I’m up to something. Stay focused.
            <br />
            <br />
            It’s important to use cocoa butter. It’s the key to more success,
            why not live smooth? Why live rough? We the best. Bless up. Let’s
            see what Chef Dee got that they don’t want us to eat. You do know,
            you do know that they don’t want you to have lunch. I’m keeping it
            real with you, so what you going do is have lunch.
          </div>
        )}
      </div>
    );
  }
}
