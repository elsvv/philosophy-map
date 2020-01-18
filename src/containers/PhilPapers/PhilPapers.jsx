import React, { Component } from "react";

import Parser from "../Parser/Parser";
import Button from "../../components/Button/Button";
import Controls from "../../components/Controls/Controls";

class PhilPapers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parsedNodes: null,
      parsedEdges: null,
      isWaiting: true,
      isFiltered: false
    };
  }

  handleGetPp = () => {
    const key = "65bYvgX7lvNpObRF";
    const id = "784298";
    let proxyUrl = "https://cors-anywhere.herokuapp.com/",
      targetUrl = `https://philpapers.org/philpapers/raw/categories.json?apiId=${id}&apiKey=${key}`;
    fetch(proxyUrl + targetUrl)
      .then(blob => blob.json())
      .then(data => {
        this.parseToVis(data);
      })
      .catch(er => {
        console.log("Catch error: ", er);
      });
  };

  parseToVis = data => {
    let parsedNodes = [],
      parsedEdges = [];

    let mainContainer = [];

    data.forEach((theme, idx) => {
      let name = theme[0],
        id = parseInt(theme[1]),
        parents = theme[2].split(",").map(el => parseInt(el)),
        primeParent = parseInt(theme[3]);
      let mainColor = false,
        mainValue = false;

      if (primeParent === 1) {
        mainContainer.push(theme);
        mainColor = "#ccc";
        mainValue = 5000;
      }

      parsedNodes.push({
        id: id,
        title: "none",
        label: name,
        value: mainValue || 10,
        color: mainColor || "#fff"
      });

      parents.forEach(par => {
        parsedEdges.push({
          from: id,
          to: par === 1 ? undefined : par,
          primeParent: primeParent
        });
      });
    });

    this.setState({
      parsedNodes,
      parsedEdges,
      isWaiting: false
    });
  };

  componentDidMount() {
    this.handleGetPp();
  }

  passUp = () => {
    this.props.handleUp(this.state.parsedNodes, this.state.parsedEdges);
  };

  render() {
    const { isWaiting, isFiltered } = this.state;
    const controls = [
      { name: "back", handler: this.props.changeDisplay, arg: "entry" },
      { name: "hide", handler: this.props.changeDisplay, arg: "hidden" }
    ];
    let message = isFiltered ? "Update graph" : "See full map";

    return (
      <div className="philpapers-container">
        <Controls controls={controls} />
        <div className="title-container">
          <h1 className="title">PhilPapers</h1>
          <p className="text">PhilPapers Component</p>
          <p className="pick">Pick data-source:</p>
        </div>
        <Button text={message} data="philpapers" handleClick={this.passUp} />
        {!isWaiting ? <h1>Finished!</h1> : null}
        {/*   <div className="button-set">
           <Button text="PhilPapers.org API" data="philpapers" />
          <Button text="InPhO API" style={{ background: "#C0C0C0" }} />
        </div>*/}
      </div>
    );
  }
}

export default PhilPapers;
