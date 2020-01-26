import React, { Component } from "react";
import "./InfoContainer.scss";

import Controls from "../../components/Controls/Controls";

class InfoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = null;
  }
  render() {
    const controls = [
      { name: "hide", handler: this.props.infoToggle, arg: false }
    ];
    return (
      <div className="InfoContainer">
        <Controls controls={controls} />
        <br />
        <h2>{this.props.label}</h2>
      </div>
    );
  }
}

export default InfoContainer;
