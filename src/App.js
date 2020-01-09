import React from "react";
import "./App.css";
// import axios from "axios";

import Parser from "./containers/Parser/Parser";
// import Graph from "./components/Graph/Graph";
import GraphCy from "./components/Graph/GraphCy";
import GraphVis from "./components/Graph/GraphVis";
import ParserContext from "./context/ParserContext";

// import { nodes, edges } from "./components/Graph/defaultData";

// const csrfToken = document.querySelector("meta[name=csrf-token]").content;
// axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      edges: [],
      graph: null,
      graphRender: false
    };
  }

  handleGraph = data => {
    console.log("1_in handleGraph:", data);
    const { nodes, edges } = data;
    console.log("2_in handleGraph:", nodes, edges);

    this.setState({
      nodes,
      edges
    });
    console.log("3_in handleGraph:");
    // forceUpdate();
  };

  render() {
    // console.log("nodes: ", nodes);
    // console.log("edges: ", edges);
    const { graphRender } = this.state;
    return (
      <div className="App">
        <ParserContext.Provider>
          <p>
            Each entry in this list represents a category. The included fields
            are:{" "}
          </p>
          <ul>
            <li>Name of the category</li>
            <li>ID of the category</li>
            <li>Comma-separated list of IDs of parents</li>
            <li>IDs of the primary parent</li>
          </ul>
          <p>Note that the root category (which has ID 1) is not included.</p>
          <Parser handleGraph={this.handleGraph} />
          {/*<GraphCy graph={this.state.graph} />*/}
          <button onClick={() => this.setState({ graphRender: !graphRender })}>
            Toggle graph!
          </button>
          {graphRender ? (
            <GraphVis nodes={this.state.nodes} edges={this.state.edges} />
          ) : null}
          <div id="network" style={{ width: "70vw", height: "70vh" }}></div>
        </ParserContext.Provider>
      </div>
    );
  }
}

export default App;
