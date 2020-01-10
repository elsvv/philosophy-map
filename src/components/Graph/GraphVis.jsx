import React from "react";
import Graph from "react-graph-vis";
// import vis from "vis-network/dist/vis-network.min.js";
// import "bootstrap/dist/css/bootstrap.min.css";

let nodes = [
  { id: 1, label: "Node 1", color: "#e04141" },
  { id: 2, label: "Node 2", color: "#e09c41" },
  { id: 3, label: "Node 3", color: "#e0df41" },
  { id: 4, label: "Node 4", color: "#7be041" },
  { id: 5, label: "Node 5", color: "#41e0c9" }
];

let edges = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 2, to: 5 }
];
//
// let nodesDataset = new vis.DataSet(nodes);
// let edgesDataset = new vis.DataSet(nodes);

const GraphVis = props => {
  // console.log("nodesDef", nodes);

  let graph = {
    nodes: nodes,
    edges: edges
  };

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000"
    }
  };

  const events = {
    click: event => {
      handleChangeColor(event);
    }
  };

  const handleChangeColor = event => {
    console.log("handleChangeColor");
    console.log("event", event);
    let nodeId = event.nodes[0];
    console.log("nodeId", nodeId);
    let selectedNode;
    for (let node of graph.nodes) {
      if (node.id === nodeId) {
        // selectedNode = node;
        node.color = "#68fff8";
        break;
      }
    }
    network.setData({ nodes: graph.nodes, edges: graph.edges });
    // selectedNode.color = "#000";
    // console.log("selectedNode", selectedNode);
  };

  let network;
  const setNetworkInstance = nw => {
    network = nw;
    console.log("network", network);
  };

  return (
    <div>
      <Graph
        graph={graph}
        options={options}
        events={events}
        getNetwork={setNetworkInstance}
        style={{ height: "640px" }}
      />
    </div>
  );
};

export default GraphVis;
