import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import colaConfig from "./colaConfig.js";

import React, { Component, useContext } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import ParserContext from "../../context/ParserContext";

cytoscape.use(cola);

let elementsParsed = [],
  elementsNodes = [],
  elementsEdges = [];
let flag = false;

const GraphCy = props => {
  if (props.graph) {
    const { graph } = props.graph;
    graph.forEach((node, idx) => {
      elementsNodes.push({ data: { id: node.id, label: node.name } });
      elementsEdges.push({
        data: {
          source: node.id,
          target: node.prParent == "1" ? undefined : node.prParent,
          label: `Edge from ${node.id} to ${node.prParent}`,
          id: node.name
        }
      });
    });
    elementsParsed = [...elementsNodes, ...elementsEdges];
    flag = true;
    console.log("elementsParsed", elementsParsed);
  }
  const elementsDefault = [
    { data: { id: "1", label: "Node 1" } },
    { data: { id: "2", label: "Node 2" } },
    {
      data: {
        source: "1",
        target: "2",
        label: "Edge from Node1 to Node2"
      }
    }
  ];

  const stylesheet = [
    {
      selector: "node",
      style: {
        "background-color": "#ffbcf1",
        label: "data(label)"
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
  ];

  const layout = {
    name: "cola",
    ...colaConfig
  };

  return (
    // elements={flag ? elementsParsed : elementsDefault}
    <div>
      {flag ? (
        <CytoscapeComponent
          // elements={elementsDefault}
          elements={elementsParsed}
          style={{ width: "100vw", height: "70vh", border: "1px solid black" }}
          boxSelectionEnabled={true}
          userPanningEnabled={true}
          stylesheet={stylesheet}
          layout={layout}
          userZoomingEnabled={true}
          // motionBlur={true}
          // motionBlurOpacity="1"
        />
      ) : null}
      <button
        onClick={() => console.log("GRAPH", props.graph)}
        style={{ display: "block" }}
      >
        To log Graph!
      </button>
    </div>
  );
};
export default GraphCy;
