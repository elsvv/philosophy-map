import React, { Component } from "react";
import "./InfoContainer.scss";

import Controls from "../../components/Controls/Controls";
import ThinkerInfo from "../../components/ThinkerInfo/ThinkerInfo";
import IdeaInfo from "../../components/IdeaInfo/IdeaInfo";

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
        <div className="info">
          <h2>{label}</h2>
          {type == "thinker" ? (
            <ThinkerInfo {...this.props.selectedData} />
          ) : (
            <IdeaInfo {...this.props.selectedData} />
          )}
        </div>
      </div>
    );
  }
}

export default InfoContainer;
