import React, { Component } from "react";
import "./InfoContainer.scss";

import Controls from "../../components/Controls/Controls";
import ThinkerContainer from "../ThinkerContainer/ThinkerContainer";
import IdeaContainer from "../IdeaContainer/IdeaContainer";

class InfoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = null;
  }
  render() {
    const { label, type } = this.props.selectedData;
    const controls = [
      { name: "hide", handler: this.props.infoToggle, arg: false }
    ];
    return (
      <div className="InfoContainer">
        <Controls controls={controls} />
        <br />
        <h2>{label}</h2>
        {type == "thinker" ? (
          <ThinkerContainer {...this.props.selectedData} />
        ) : (
          <IdeaContainer {...this.props.selectedData} />
        )}
      </div>
    );
  }
}

export default InfoContainer;
