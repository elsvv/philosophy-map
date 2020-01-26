import React from "react";
import Draggable from "react-draggable";
import "./App.css";

import Parser from "./containers/Parser/Parser";
// import Graph from "./components/Graph/Graph";
import GraphCy from "./components/Graph/GraphCy";
import GraphVis from "./components/Graph/GraphVis";
import GraphVisPerf from "./components/Graph/GraphVisPerf";
import ReactGraphVisNeibours from "./components/Graph/ReactGraphVisNeibours";
import ParserContext from "./context/ParserContext";

import MenuContainer from "./containers/MenuContainer/MenuContainer";

import Loader from "./components/Loader/Loader";

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
      graphRender: false,
      loading: false
    };
  }

  handleUp = (nodes, edges) => {
    const { graphRender } = this.state;
    this.setState({ nodes, edges, graphRender: true });
    // console.log("this.state.graphRender", this.state.graphRender);
    // this.setState({ graphRender: false });
    // console.log("this.state.nodes", this.state.nodes);
    // this.setState({ graphRender: !graphRender });
    // console.log("this.state.graphRender", this.state.graphRender);
  };

  toggleLoader = () => {
    const { loading } = this.state;
    this.setState({ loading: !loading });
  };

  render() {
    const { graphRender, loading } = this.state;

    return (
      <div className="App">
        <ParserContext.Provider>
          {graphRender ? (
            <ReactGraphVisNeibours
              nodes={this.state.nodes}
              edges={this.state.edges}
            />
          ) : null}

          {loading ? <Loader /> : null}

          <MenuContainer
            toggleLoader={this.toggleLoader}
            handleUp={this.handleUp}
          />
          {/*  <Draggable>
            <div className="draggable">
              <MenuContainer handleUp={this.handleUp} />
            </div>
          </Draggable>*/}
        </ParserContext.Provider>
      </div>
    );
  }
}

export default App;
