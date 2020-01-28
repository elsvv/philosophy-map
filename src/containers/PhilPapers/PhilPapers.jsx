import React, { Component } from "react";
import "./PhilPapers.scss";

import Parser from "../Parser/Parser";
import Button from "../../components/Button/Button";
import SearchBar from "../../components/SearchBar/SearchBar";
import Controls from "../../components/Controls/Controls";

class PhilPapers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parsedNodes: null,
      parsedEdges: null,
      nodes: null,
      edges: null,
      isWaiting: true,
      isFiltered: false,
      toFind: "",
      preview: null
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
    this.props.toggleLoader();
  };

  componentDidMount() {
    this.handleGetPp();
  }

  passUp = (nodes, edges) => {
    this.props.handleUp(nodes, edges);
  };

  handleSearch = event => {
    if (!event.target.value) {
      this.setState({ nodes: null, edges: null, isFiltered: false });
    }
    let search = event.target.value.toLowerCase();
    this.setState({ toFind: search });

    if (search.length >= 3) {
      let preview = this.state.parsedNodes
        .filter(node => node.label.toLowerCase().includes(search))
        .reduce((ac, el) => [...ac, { label: el.label, id: el.id }], []);
      return this.setState({ preview: preview });
    }
    this.setState({ preview: null });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { parsedNodes, toFind, parsedEdges } = this.state;

    const resNodes = parsedNodes.filter(node =>
      node.label.toLowerCase().includes(toFind)
    );
    const searchIds = [];
    resNodes.forEach(node => {
      node.color = "#fff";
      node.value = 5000;
      searchIds.push(node.id);
    });

    const resEdges = parsedEdges.filter(edge => {
      return searchIds.includes(edge.to) || searchIds.includes(edge.from);
    });

    const childSet = new Set();
    resEdges.forEach(edge => {
      if (!(childSet.has(edge.to) || childSet.has(edge.from))) {
        childSet.add(edge.to);
        childSet.add(edge.from);
      }
    });
    const childIds = [...childSet];

    parsedNodes.forEach(node => {
      if (childIds.includes(node.id) && !resNodes.includes(node)) {
        resNodes.push(node);
      }
    });

    this.setState({ nodes: resNodes, edges: resEdges, isFiltered: true });
    // if (resNodes && resEdges) {
    // }
  };

  handleOption = event => {
    console.log("handleOption");
    const selectedId = event.target.dataset.id;
    const { parsedEdges, parsedNodes } = this.state;

    let relatedIds = [];
    let edges = [];

    parsedEdges.forEach(edge => {
      if (edge.to == selectedId || edge.from == selectedId) {
        edges.push(edge);
        relatedIds.push(edge.to);
        relatedIds.push(edge.from);
      }
    });

    let nodes = [];
    relatedIds.forEach(id => {
      parsedNodes.forEach(node => {
        if (node.id == id) {
          nodes.push(node);
        }
      });
    });

    nodes = [...new Set(nodes)];

    relatedIds = [...new Set(relatedIds)];
    console.log("relatedIds", relatedIds);
    console.log("nodes", nodes);

    this.setState({ nodes, edges, isFiltered: true });
    this.passUp(nodes, edges);
  };

  render() {
    const { isWaiting, isFiltered } = this.state;
    const controls = [
      { name: "back", handler: this.props.changeDisplay, arg: "entry" },
      { name: "hide", handler: this.props.changeDisplay, arg: "hidden" }
    ];
    const nodes = this.state.nodes || this.state.parsedNodes;
    const edges = this.state.edges || this.state.parsedEdges;
    let message = isFiltered ? "Update graph" : "See full map";

    return (
      <div className="philpapers-container">
        <Controls controls={controls} />
        <div className="text-container">
          <h1 className="title">PhilPapers</h1>
          <p className="text">PhilPapers Component</p>
          <p className="pick">Pick data-source:</p>
        </div>

        <SearchBar
          handleSubmit={this.handleSubmit}
          handleSearch={this.handleSearch}
          preview={this.state.preview}
          handleOption={this.handleOption}
        />
        {!isWaiting ? (
          <>
            <Button
              text={message}
              data="philpapers"
              handleClick={() => this.passUp(nodes, edges)}
            />
          </>
        ) : null}
        {/*   <div className="button-set">
           <Button text="PhilPapers.org API" data="philpapers" />
          <Button text="InPhO API" style={{ background: "#C0C0C0" }} />
        </div>*/}
      </div>
    );
  }
}

export default PhilPapers;
