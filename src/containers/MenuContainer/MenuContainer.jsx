import React, { Component } from "react";
// import Draggable from "react-draggable";
import "./MenuContainer.scss";

import Entry from "../../components/Entry/Entry";
import PhilPapers from "../PhilPapers/PhilPapers";
import InPho from "../InPho/InPho";

class MenuContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "entry"
    };
  }

  changeDisplay = display => {
    this.setState({ display });
  };

  render() {
    const { display } = this.state;
    return (
      <div className="MenuContainer">
        {display === "entry" ? (
          <Entry
            changeDisplay={this.changeDisplay}
            toggleLoader={this.props.toggleLoader}
          />
        ) : null}
        {display === "philpapers" ? (
          <PhilPapers
            changeDisplay={this.changeDisplay}
            handleUp={this.props.handleUp}
            toggleLoader={this.props.toggleLoader}
          />
        ) : null}
        {display === "inpho" ? (
          <InPho
            infoToggle={this.props.infoToggle}
            handleSelectedUp={this.props.handleSelectedUp}
            changeDisplay={this.changeDisplay}
            handleUp={this.props.handleUp}
            toggleLoader={this.props.toggleLoader}
          />
        ) : null}
      </div>
    );
  }
}

export default MenuContainer;

// <Preview />
