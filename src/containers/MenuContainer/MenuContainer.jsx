import React, { Component } from "react";

class MenuContainer extends Component {
  constructor(props) {
    super(props);
    this.state = null;
  }
  render() {
    return (
      <div className="MenuContainer">
        <h1>{this.state.header}</h1>
        <p>
          Here you can observe philosophy. This app uses some open APIs and
          parses it to graph which is quite convinient bla bla bla...{" "}
        </p>
      </div>
    );
  }
}

export default MenuContainer;

// <Preview />
