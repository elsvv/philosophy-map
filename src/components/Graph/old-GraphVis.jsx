import React, { Component, useContext, useState } from "react";
import Graph from "react-graph-vis";

import ParserContext from "../../context/ParserContext";

class GraphVis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graph: {
        nodes: [
          { id: 1, label: "Катя", color: "#e04141" },
          { id: 2, label: "Нина", color: "#e09c41" },
          { id: 3, label: "Ксюша", color: "#e0df41" },
          { id: 4, label: "Катюша", color: "#7be041" },
          { id: 5, label: "Егор Олегович", color: "#41e0c9" }
        ],
        edges: [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 4 },
          { from: 2, to: 5 }
        ]
      },
      options: {
        interaction: { hover: true },
        layout: {
          hierarchical: false
        },
        nodes: {
          shape: "dot",
          scaling: {
            min: 10,
            max: 30,
            label: {
              min: 8,
              max: 30,
              drawThreshold: 12,
              maxVisible: 20
            }
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
        physics: false,
        interaction: {
          tooltipDelay: 200,
          hideEdgesOnDrag: true,
          hideEdgesOnZoom: true
        }
      },
      events: {
        select: event => {
          console.log("Event:");
          console.log(event);
          var { nodes, edges } = event;
          console.log("Selected nodes:");
          console.log(nodes);
          console.log("Selected edges:");
          console.log(edges);
        },
        hoverNode: event => {
          console.log("HOVER");
          this.neighbourhoodHighlight(event);
        }
        // hoverNode:
      },
      network: null,
      highlightActive: false
    };
  }

  componentDidMount() {
    console.log("GraphVis state: ", this.state);
  }

  setNetworkInstance = nw => {
    this.setState({
      network: nw
    });
    console.log("setNetworkInstance: ", nw);
  };

  neighbourhoodHighlight = params => {
    console.log("yo!");
    let { network, highlightActive } = this.state;
    let allNodes = { ...this.state.graph.nodes };
    // if something is selected:
    if (params.nodes.length > 0) {
      highlightActive = true;
      var i, j;
      var selectedNode = params.nodes[0];
      var degrees = 2;

      // mark all nodes as hard to read.
      for (var nodeId in allNodes) {
        allNodes[nodeId].color = "rgba(200,200,200,0.5)";
        if (allNodes[nodeId].hiddenLabel === undefined) {
          allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
          allNodes[nodeId].label = undefined;
        }
      }
      var connectedNodes = network.getConnectedNodes(selectedNode);
      var allConnectedNodes = [];

      // get the second degree nodes
      for (i = 1; i < degrees; i++) {
        for (j = 0; j < connectedNodes.length; j++) {
          allConnectedNodes = allConnectedNodes.concat(
            network.getConnectedNodes(connectedNodes[j])
          );
        }
      }

      // all second degree nodes get a different color and their label back
      // for (i = 0; i < allConnectedNodes.length; i++) {
      //   allNodes[allConnectedNodes[i]].color = "rgba(150,150,150,0.75)";
      //   if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
      //     allNodes[allConnectedNodes[i]].label =
      //       allNodes[allConnectedNodes[i]].hiddenLabel;
      //     allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
      //   }
      // }

      // all first degree nodes get their own color and their label back
      for (i = 0; i < connectedNodes.length; i++) {
        allNodes[connectedNodes[i]].color = undefined;
        if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
          allNodes[connectedNodes[i]].label =
            allNodes[connectedNodes[i]].hiddenLabel;
          allNodes[connectedNodes[i]].hiddenLabel = undefined;
        }
      }

      // the main node gets its own color and its label back.
      allNodes[selectedNode].color = undefined;
      if (allNodes[selectedNode].hiddenLabel !== undefined) {
        allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
        allNodes[selectedNode].hiddenLabel = undefined;
      }
    } else if (highlightActive === true) {
      // reset all nodes
      for (var nodeId in allNodes) {
        allNodes[nodeId].color = undefined;
        if (allNodes[nodeId].hiddenLabel !== undefined) {
          allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
          allNodes[nodeId].hiddenLabel = undefined;
        }
      }
      highlightActive = false;
    }

    // transform the object into an array
    var updateArray = [];
    for (nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        updateArray.push(allNodes[nodeId]);
      }
    }

    this.setState({
      network,
      graph: { nodes: updateArray }
    });
    console.log("END updateArray", updateArray);
    console.log("END allNodes", allNodes);
    // nodesDataset.update(updateArray);
  };

  render() {
    const { graph, options, events, network } = this.state;
    return (
      <div>
        {true ? (
          <Graph
            style={{
              width: "800px",
              height: "800px",
              border: "1px solid lightgray"
            }}
            graph={graph}
            options={options}
            events={events}
            getNetwork={this.setNetworkInstance}
          />
        ) : null}
        <button
          onClick={() => console.log("network", network)}
          style={{ display: "block" }}
        >
          To log Graph!
        </button>
      </div>
    );
  }
}

export default GraphVis;
