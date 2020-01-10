import React, { Component, useContext, useState } from "react";
import Graph from "react-graph-vis";

import ParserContext from "../../context/ParserContext";

class ReactGraphVis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graph: {
        nodes: this.props.nodes,
        edges: this.props.edges
      },
      // options: {
      //   interaction: { hover: true },
      //   layout: {
      //     hierarchical: false
      //   },
      //   nodes: {
      //     shape: "dot",
      //     scaling: {
      //       min: 10,
      //       max: 30,
      //       label: {
      //         min: 8,
      //         max: 30,
      //         drawThreshold: 12,
      //         maxVisible: 20
      //       }
      //     },
      //     font: {
      //       size: 12,
      //       face: "Tahoma"
      //     }
      //   },
      //   edges: {
      //     width: 0.15,
      //     color: { inherit: "from" },
      //     smooth: {
      //       type: "continuous"
      //     }
      //   },
      //   physics: false,
      //   interaction: {
      //     tooltipDelay: 200,
      //     hideEdgesOnDrag: true,
      //     hideEdgesOnZoom: true
      //   }
      // },
      options: {
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
          tooltipDelay: 200,
          hideEdgesOnDrag: true
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
        }
        // hoverNode:
      },
      network: null,
      highlightActive: false
    };
  }

  componentDidMount() {
    console.log("Finished");
  }

  setNetworkInstance = nw => {
    this.setState({
      network: nw
    });
  };

  render() {
    const { graph, options, events, network } = this.state;
    return (
      <div>
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
      </div>
    );
  }
}

export default ReactGraphVis;
