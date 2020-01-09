import React, { Component } from "react";

import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import colaConfig from "./colaConfig.js";
// import CytoscapeComponent from "react-cytoscapejs";

cytoscape.use(cola);

console.log(cola);

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = null;
  }
  componentDidMount() {
    var cy = cytoscape({
      container: document.getElementById("graph"), // container to render in

      elements: [
        // list of graph elements to start with
        {
          // node a
          data: { id: "Катя" }
        },
        {
          // node b
          data: { id: "Слава" }
        },
        {
          // edge ab
          data: { id: "КатяСлава", source: "Катя", target: "Слава" }
        }
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#ffbcf1",
            label: "data(id)"
          }
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle"
          }
        }
      ],
      layout: {
        name: "cola",
        colaConfig
      },
      motionBlur: true,
      motionBlurOpacity: 0.5,
      userPanningEnabled: false,
      boxSelectionEnabled: false
    });
  }

  render() {
    return (
      <div>
        <div id="graph" style={{ height: "100vh" }}></div>
      </div>
    );
  }
}

export default Graph;
