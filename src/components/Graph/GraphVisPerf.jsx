import React from "react";
import vis from "vis";

const GraphVisPerf = props => {
  console.log("GraphVisPerf started");
  var network;

  function redrawAll() {
    // remove positoins

    // create a network
    var container = document.getElementById("network");
    var data = {
      nodes: props.nodes,
      edges: props.edges
    };
    var options = {
      nodes: {
        shape: "dot",
        scaling: {
          min: 10,
          max: 30
        },
        font: {
          size: 12,
          face: "Tahoma"
        }
      },
      edges: {
        width: 0.15,
        color: { inherit: "from" },
        smooth: {
          type: "continuous"
        }
      },
      physics: {
        stabilization: false,
        barnesHut: {
          gravitationalConstant: -80000,
          springConstant: 0.001,
          springLength: 200
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        hideEdgesOnDrag: true,
        hoverConnectedEdges: true
      }
    };

    // Note: data is coming from ./datasources/WorldCup2014.js
    network = new vis.Network(container, data, options);
  }

  redrawAll();
  console.log("GraphVisPerf finished");

  return <></>;
};

export default GraphVisPerf;
