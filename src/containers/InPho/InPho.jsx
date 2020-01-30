import React, { Component } from "react";
import axios from "axios";

import "./InPho.scss";
import { taxonomyNodes, taxonomyEdges } from "../../components/Graph/taxonomy";

import Parser from "../Parser/Parser";
import Button from "../../components/Button/Button";
import SearchBar from "../../components/SearchBar/SearchBar";
import Controls from "../../components/Controls/Controls";
import TextComponent from "../../components/TextComponent/TextComponent";

const url = "https://www.inphoproject.org/";

class InPho extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taxonomyNodes,
      taxonomyEdges,
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
      // other: [],
      selectedData: null,
      toRender: null
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
          thinkers = [];
        // ,
        // other = [];

        data.forEach(el => {
          if (el.type == "idea") {
            ideas.push(el);
          }
          if (el.type == "thinker") {
            thinkers.push(el);
          }
          // if (el.type != "thinker" && el.type != "idea") {
          //   other.push(el);
          // }
        });

        this.setState({
          ideas,
          thinkers,
          // other,
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
      let previewIdeas = this.state.ideas.filter(node =>
        node.label.toLowerCase().includes(search)
      );
      let previewIds = previewIdeas.map(el => el.ID);
      previewIdeas = previewIdeas.reduce(
        (ac, el) => [...ac, { label: el.label, id: el.ID }],
        []
      );

      let previewThinkers = this.state.thinkers.filter(node =>
        node.label.toLowerCase().includes(search)
      );
      previewIds = [...previewIds, ...previewThinkers.map(el => el.ID)];
      previewThinkers = previewThinkers.reduce(
        (ac, el) => [...ac, { label: el.label, id: el.ID }],
        []
      );

      const preview = [...previewIdeas, ...previewThinkers];
      return this.setState({ preview, previewIds });
    }
    this.setState({ preview: null });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { previewIds } = this.state;

    let toRender = {};
    console.log("START MASS GET");
    previewIds.forEach(id => {
      axios.get(`${url}/entity/${id}.json`).then(idRes => {
        const idData = idRes.data;
        if (idData.type === "idea") {
          const {
            related,
            instances,
            hyponyms,
            related_thinkers,
            occurrences,
            label
          } = idData;

          toRender[`n${id}`] = {
            label,
            related,
            instances,
            hyponyms,
            related_thinkers,
            occurrences
          };
        } else {
          const {
            label,
            influenced,
            influenced_by,
            related_ideas,
            related_thinkers
          } = idData;

          toRender[`n${id}`] = {
            label,
            influenced,
            influenced_by,
            related_ideas,
            related_thinkers
          };
        }
      });
    });

    console.log("FINISH MASS GET");
    console.log("toRender", toRender);
    this.setState({ toRender });
    setTimeout(() => this.handleCollectAll(), 5000);
    // this.handleCollectAll();
  };

  handleCollectAll = () => {
    const { previewIds, toRender, ideas, thinkers } = this.state;
    let nodesIds = [],
      nodes = [],
      edges = [];
    previewIds.forEach(id => {
      console.log(toRender[`n${id}`]);
      delete toRender[`n${id}`].label;
      const idList = Object.values(toRender[`n${id}`]);
      for (let li of idList) {
        console.log("li", li);
        for (let to of li) {
          console.log("to", to);
          edges.push({
            from: id,
            to
          });
        }
        nodesIds.push(...li);
      }
    });
    nodesIds = [...new Set(nodesIds)];

    // Без групп пока
    nodesIds.forEach(nId => {
      let isImportant = false;
      if (previewIds.includes(nId)) {
        isImportant = true;
      }
      const node =
        ideas.find(idea => idea.ID === nId) ||
        thinkers.find(th => th.ID === nId);
      nodes.push({
        id: node.ID,
        label: node.label,
        // value: isImportant ? 1000000 : 20000
        size: isImportant ? 35 : 15
      });
    });

    console.log(nodes);
    this.setState({ nodes, edges });
    this.passUp(nodes, edges);
  };

  handleOption = event => {
    console.log("handleOption");
    const selectedId = parseInt(event.target.dataset.id);
    const selectedLabel = event.target.innerHTML;
    axios
      .get(`${url}/entity/${selectedId}.json`)
      .then(res => {
        const selectedData = res.data;
        console.log("selectedData:", selectedData);
        const nodes = [],
          edges = [];

        // THINKER PARSER
        if (selectedData.type === "thinker") {
          const { thinkers } = this.state;

          selectedData.influenced.forEach(influenced => {
            edges.push({ to: selectedId, from: influenced });
            for (let thinker of thinkers) {
              if (thinker.ID == influenced) {
                nodes.push({
                  id: thinker.ID,
                  label: thinker.label,
                  group: "influenced"
                });
                break;
              }
            }
          });
          selectedData.influenced_by.forEach(influenced_by => {
            edges.push({ to: influenced_by, from: selectedId });
            for (let thinker of thinkers) {
              if (selectedData.influenced.includes(thinker.ID)) {
                nodes.find(node => node.id == thinker.ID).group =
                  "influenced_by_and_influenced_by";
                continue;
              }
              if (thinker.ID == influenced_by) {
                nodes.push({
                  id: thinker.ID,
                  label: thinker.label,
                  group: "influenced_by"
                });
                break;
              }
            }
          });
        }
        // IDEA PARSER
        if (selectedData.type === "idea") {
          const { ideas } = this.state;

          selectedData.occurrences.forEach(occurrence => {
            edges.push({ from: occurrence, to: selectedId });
            for (let idea of ideas) {
              if (idea.ID == occurrence) {
                nodes.push({
                  id: idea.ID,
                  label: idea.label,
                  group: "occurrences"
                });
                break;
              }
            }
          });
          selectedData.hyponyms.forEach(hyp => {
            edges.push({ from: selectedId, to: hyp });
            for (let idea of ideas) {
              if (selectedData.occurrences.includes(idea.ID)) {
                nodes.find(node => node.id == idea.ID).group =
                  "occurrences_and_hyponyms";
                continue;
              }
              if (idea.ID == hyp) {
                nodes.push({
                  id: idea.ID,
                  label: idea.label,
                  group: "hyponyms"
                });
                break;
              }
            }
          });
        }

        nodes.push({ id: selectedId, label: selectedLabel });

        console.log("nodes", nodes);
        console.log("edges", edges);
        this.setState({ nodes, edges, selectedData });

        this.passUp(nodes, edges);
        this.props.handleSelectedUp(selectedData);
        this.props.infoToggle(true);
        return;
      })
      .catch(error => console.log("Catch error:", error));
  };

  passUp = (nodes, edges) => {
    this.props.handleUp(nodes, edges);
  };

  render() {
    const { isWaiting, isFiltered } = this.state;
    const controls = [
      { name: "back", handler: this.props.changeDisplay, arg: "entry" },
      { name: "mini", handler: this.props.changeDisplay, arg: "hidden" }
    ];
    const nodes = this.state.nodes || this.state.taxonomyNodes;
    const edges = this.state.edges || this.state.taxonomyEdges;
    let message = isFiltered ? "Update graph" : "See taxonomy";

    return (
      <div className="inpho-container">
        <Controls controls={controls} />
        <TextComponent
          description="Data parsed via InPhO API. Here you can visualize the philosophy taxonomy with more then 250 nodes. Or search for concrete topic, its info and its relateted authors/concepts."
          title="Internet Philosophy Ontology project"
          pick="Start typing for a thinker/idea:"
          waiting="data is loading..."
          isWaiting={isWaiting}
        />
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
      </div>
    );
  }
}

export default InPho;
