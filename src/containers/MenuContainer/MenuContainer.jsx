import React, { Component } from "react";
import Draggable from "react-draggable";
import "./MenuContainer.scss";

import Entry from "../../components/Entry/Entry";
import PhilPapers from "../PhilPapers/PhilPapers";
import InPho from "../InPho/InPho";

class MenuContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "entry",
      draggie: false
    };
  }

  changeDisplay = display => {
    this.setState({ display });
  };

  toggleDraggie = () => {
    const { draggie } = this.state;
    this.setState({ draggie: !draggie });
    console.log("toggleDraggie", this.state.draggie);
  };

  render() {
    const { display, draggie } = this.state;

    const switcher = draggie
      ? { name: "max", handler: this.toggleDraggie, arg: "draggie" }
      : { name: "mini", handler: this.toggleDraggie, arg: "draggie" };
    const controls = [
      { name: "back", handler: this.changeDisplay, arg: "entry" },
      switcher
    ];

    const MenuContainerRender = (
      <div className="MenuContainer">
        {display === "entry" ? (
          <Entry
            changeDisplay={this.changeDisplay}
            toggleLoader={this.props.toggleLoader}
          />
        ) : null}
        {display === "philpapers" ? (
          <PhilPapers
            doubleClicked={this.props.doubleClicked}
            controls={controls}
            toggleDraggie={this.toggleDraggie}
            draggie={draggie}
            changeDisplay={this.changeDisplay}
            handleUp={this.props.handleUp}
            toggleLoader={this.props.toggleLoader}
          />
        ) : null}
        {display === "inpho" ? (
          <InPho
            doubleClicked={this.props.doubleClicked}
            controls={controls}
            toggleDraggie={this.toggleDraggie}
            draggie={draggie}
            infoToggle={this.props.infoToggle}
            handleSelectedUp={this.props.handleSelectedUp}
            changeDisplay={this.changeDisplay}
            handleUp={this.props.handleUp}
            toggleLoader={this.props.toggleLoader}
          />
        ) : null}
      </div>
    );
    // if (draggie) {
    //   return <Draggable>{MenuContainerRender}</Draggable>;
    // }

    return MenuContainerRender;
  }
}

export default MenuContainer;
