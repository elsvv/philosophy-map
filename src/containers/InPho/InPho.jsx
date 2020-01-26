import React, { Component } from "react";
import axios from "axios";

import "./InPho.scss";

import Parser from "../Parser/Parser";
import Button from "../../components/Button/Button";
import SearchBar from "../../components/SearchBar/SearchBar";
import Controls from "../../components/Controls/Controls";

const url = "https://www.inphoproject.org/";

class InPho extends Component {
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
      preview: null,
      ideas: [],
      thinkers: [],
      other: []
    };
  }

  handleGetEntity = () => {
    console.log("handleGetEntity");
    axios
      .get(`${url}entity.json`)
      .then(res => {
        const data = res.data.responseData.results,
          ideas = [],
          deas = [],
          thinkers = [],
          other = [];

        data.forEach(el => {
          if (el.type == "idea") {
            ideas.push(el);
          }
          if (el.type == "thinker") {
            thinkers.push(el);
          }
          if (el.type != "thinker" && el.type != "idea") {
            other.push(el);
          }
        });

        this.setState({
          ideas,
          thinkers,
          other,
          isWaiting: false
        });
        console.log("ideas", this.state.ideas);
        console.log("thinkers", this.state.thinkers);
        this.props.toggleLoader();
      })
      .catch(error => {
        console.log("Catch error:", error);
      });
  };

  handleGetInPho = () => {
    console.log("handleGetInPho");
    const ids = [];
    // let path = "idea/20/graph";
    let path = "idea/931/graph";
    axios
      .get(`${url}/${path}.json`)
      .then(res => console.log(res))

      // complex then parser
      .then(res => {
        console.log(res);
        const parsed = res.data.split("entropy*float")[1].split("\n\n");

        const nodesInfo = parsed[0].split("\n");
        nodesInfo.splice(0, 1);

        const nodes = [];
        nodesInfo.forEach((node, idx) => {
          let nodeAr = node.split(' "');
          nodes.push({
            id: parseInt(nodeAr[0]),
            label: nodeAr[1].replace(/^[\"]+|[\"]+$/g, ""),
            sep: nodeAr[2] == '""' ? null : nodeAr[2]
          });
        });
        console.log("nodesInfo", nodesInfo);

        const edgesInfo = parsed[1].split("weight*float\n")[1].split("\n");
        console.log("edgesInfo", edgesInfo);

        const edges = [];
        edgesInfo.forEach(edge => {
          let edgeAr = edge.split(" ");
          // console.log("edgeAr", edgeAr);
          edges.push({
            from: parseInt(edgeAr[0]),
            to: parseInt(edgeAr[1])
          });
        });

        this.setState({
          nodes,
          edges,
          isWaiting: false
        });

        this.props.toggleLoader();
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
    this.handleGetEntity();
    // this.handleGetInPho();
  }

  handleSearch = event => {
    if (!event.target.value) {
      this.setState({ nodes: null, edges: null, isFiltered: false });
    }
    let search = event.target.value.toLowerCase();
    this.setState({ toFind: search });

    if (search.length >= 3) {
      const previewIdeas = this.state.ideas
        .filter(node => node.label.toLowerCase().includes(search))
        .reduce((ac, el) => [...ac, { label: el.label, id: el.ID }], []);

      const previewThinkers = this.state.thinkers
        .filter(node => node.label.toLowerCase().includes(search))
        .reduce((ac, el) => [...ac, { label: el.label, id: el.ID }], []);

      let preview = [...previewIdeas, ...previewThinkers];
      return this.setState({ preview });
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
    const selectedId = parseInt(event.target.dataset.id);
    const selectedLabel = event.target.innerHTML;
    console.log("selectedId", selectedId);
    axios
      .get(`${url}/entity/${selectedId}.json`)
      .then(res => {
        const selectedData = res.data;
        console.log(selectedData);

        const nodes = [],
          nodesIds = [],
          edges = [];
        if (selectedData.type === "thinker") {
          const { thinkers } = this.state;
          console.log("thinkers", thinkers);

          // nodesIds = [
          //   selectedId,
          //   ...selectedData.influenced,
          //   ...selectedData.influenced_by
          // ];
          selectedData.influenced.forEach(influenced => {
            edges.push({ from: selectedId, to: influenced });
          });
          selectedData.influenced_by.forEach(influenced_by => {
            edges.push({ from: influenced_by, to: selectedId });
          });
          selectedData.influenced.forEach(id => {
            for (let thinker of thinkers) {
              if (thinker.ID == id) {
                nodes.push({
                  id: thinker.ID,
                  label: thinker.label,
                  group: "influenced"
                });
                break;
              }
            }
          });
          selectedData.influenced_by.forEach(id => {
            for (let thinker of thinkers) {
              if (thinker.ID == id) {
                nodes.push({
                  id: thinker.ID,
                  label: thinker.label,
                  group: "influenced_by"
                });
                break;
              }
            }
          });
          nodes.unshift({ id: selectedId, label: selectedLabel });

          console.log("nodes", nodes);
          console.log("edges", edges);
          this.setState({ nodes, edges });
          this.passUp(nodes, edges);
        }
      })
      .catch(error => console.log("Catch error:", error));
    // const { parsedEdges, parsedNodes } = this.state;
    //
    // let relatedIds = [];
    // let edges = [];
    //
    // parsedEdges.forEach(edge => {
    //   if (edge.to == selectedId || edge.from == selectedId) {
    //     edges.push(edge);
    //     relatedIds.push(edge.to);
    //     relatedIds.push(edge.from);
    //   }
    // });
    //
    // let nodes = [];
    // relatedIds.forEach(id => {
    //   parsedNodes.forEach(node => {
    //     if (node.id == id) {
    //       nodes.push(node);
    //     }
    //   });
    // });
    //
    // nodes = [...new Set(nodes)];
    //
    // relatedIds = [...new Set(relatedIds)];
    // console.log("relatedIds", relatedIds);
    // console.log("nodes", nodes);
    //
    // this.setState({ nodes, edges, isFiltered: true });
    // this.passUp(nodes, edges);
  };

  passUp = (nodes, edges) => {
    this.props.handleUp(nodes, edges);
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
        <div className="title-container">
          <h1 className="title">Internet Philosophy Ontology project</h1>
          {/*<p className="text">PhilPapers Component</p>*/}
          <p className="pick">Pick data-source:</p>
        </div>

        {!isWaiting ? (
          <>
            <SearchBar
              handleSubmit={this.handleSubmit}
              handleSearch={this.handleSearch}
              preview={this.state.preview}
              handleOption={this.handleOption}
            />
            <Button
              text={message}
              data="inpho"
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

export default InPho;
