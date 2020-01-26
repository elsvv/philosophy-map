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
import InfoContainer from "./containers/InfoContainer/InfoContainer";

import Loader from "./components/Loader/Loader";

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
      loading: false,
      selectedData: null,
      displayInfo: false
    };
  }

  handleUp = (nodes, edges) => {
    const { graphRender } = this.state;
    this.setState({ nodes, edges, graphRender: true });
  };

  toggleLoader = () => {
    const { loading } = this.state;
    this.setState({ loading: !loading });
  };

  handleSelectedUp = selectedData => {
    this.setState({ selectedData });
  };

  infoToggle = bool => {
    this.setState({ displayInfo: bool });
  };

  render() {
    const { graphRender, loading, selectedData, displayInfo } = this.state;

    return (
      <div className="App">
        <ParserContext.Provider>
          {displayInfo ? (
            <InfoContainer
              {...selectedData}
              infoToggle={this.infoToggle}
              toggleLoader={this.toggleLoader}
              handleUp={this.handleUp}
            />
          ) : null}
          {graphRender ? (
            <ReactGraphVisNeibours
              nodes={this.state.nodes}
              edges={this.state.edges}
            />
          ) : null}

          {loading ? <Loader /> : null}

          <MenuContainer
            infoToggle={this.infoToggle}
            handleSelectedUp={this.handleSelectedUp}
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
