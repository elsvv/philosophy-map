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
          if (el.type === "idea") {
            ideas.push(el);
          }
          if (el.type === "thinker") {
            thinkers.push(el);
          }
        });

        this.setState({
          ideas,
          thinkers,
          // other,
          isWaiting: false
        });
        this.props.toggleLoader();
      })
      .catch(error => {
        console.log("Catch error:", error);
      });
  };

  componentDidMount() {
    this.handleGetEntity();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.doubleClicked != this.props.doubleClicked) {
      this.handleRender(nextProps.doubleClicked);
    }
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
      return this.setState({ preview, previewIds, isFiltered: true });
    }
    this.setState({ preview: null, isFiltered: false });
  };

  handleSubmit = event => {
    if (event.preventDefault instanceof Function) {
      event.preventDefault();
    }
    const { previewIds, isFiltered } = this.state;

    if (!isFiltered || previewIds.length === 0) {
      return false;
    }

    this.props.toggleLoader();

    let toRender = {};
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

    this.setState({ toRender });
    setTimeout(() => this.handleCollectAll(), 6000);
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
        for (let to of li) {
          edges.push({
            from: id,
            to
          });
        }
        nodesIds.push(...li);
      }
    });
    nodesIds.push(...previewIds);
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
        size: isImportant ? 35 : 15
      });
    });

    this.setState({ nodes, edges });
    this.passUp(nodes, edges);
    this.props.toggleLoader();
  };

  handleOption = event => {
    const selectedId = parseInt(event.target.dataset.id);
    this.handleRender(selectedId);
  };

  handleRender = selectedId => {
    axios
      .get(`${url}/entity/${selectedId}.json`)
      .then(res => {
        const selectedData = res.data;

        if (selectedData.type === "node") {
          return this.handleRender(selectedData.idea);
        }

        const selectedLabel = selectedData.label;
        console.log("selectedData:", selectedData);
        const nodes = [],
          edges = [];

        const { ideas, thinkers } = this.state;

        // THINKER PARSER
        if (selectedData.type === "thinker") {
          selectedData.influenced.forEach(influenced => {
            edges.push({ to: selectedId, from: influenced });
            for (let thinker of thinkers) {
              if (thinker.ID == influenced) {
                nodes.push({
                  id: thinker.ID,
                  level: 1,
                  label: thinker.label,
                  group: "influenced"
                });
                break;
              }
            }
          });

          selectedData.related_ideas.forEach(relIdea => {
            edges.push({ to: relIdea, from: selectedId });
            for (let idea of ideas) {
              if (idea.ID === relIdea) {
                nodes.push({
                  id: idea.ID,
                  level: 2,
                  label: idea.label,
                  group: "related_ideas"
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
                  "influenced_and_influenced_by";
                nodes.find(node => node.id == thinker.ID).level = 4;
                continue;
              }
              if (thinker.ID == influenced_by) {
                nodes.push({
                  id: thinker.ID,
                  level: 3,
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

          selectedData.related_thinkers.forEach(relThinker => {
            edges.push({ from: selectedId, to: relThinker });
            for (let thinker of thinkers) {
              if (thinker.ID === relThinker) {
                nodes.push({
                  id: thinker.ID,
                  label: thinker.label,
                  group: "related_thinkers"
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

          selectedData.instances.forEach(ins => {
            edges.push({ from: selectedId, to: ins });
            for (let idea of ideas) {
              if (
                selectedData.occurrences.includes(idea.ID) &&
                selectedData.hyponyms.includes(idea.ID)
              ) {
                nodes.find(node => node.id == idea.ID).group =
                  "occurrences_hyponyms_and_instances";
                continue;
              }
              if (selectedData.hyponyms.includes(idea.ID)) {
                nodes.find(node => node.id == idea.ID).group =
                  "hyponymss_and_instances";
                continue;
              }
              if (selectedData.occurrences.includes(idea.ID)) {
                nodes.find(node => node.id == idea.ID).group =
                  "occurrences_and_instances";
                continue;
              }
              if (idea.ID == ins) {
                nodes.push({
                  id: idea.ID,
                  label: idea.label,
                  group: "instances"
                });
                break;
              }
            }
          });
        }

        nodes.push({ id: selectedId, label: selectedLabel, level: 5 });
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
    const nodes = this.state.nodes || this.state.taxonomyNodes;
    const edges = this.state.edges || this.state.taxonomyEdges;
    const buttonHandler = isFiltered
      ? this.handleSubmit
      : () => this.passUp(nodes, edges);
    let message = isFiltered ? "See results' connections" : "See taxonomy";

    if (this.props.draggie) {
      return (
        <div className="draggie">
          <Controls controls={this.props.controls} />
        </div>
      );
    }

    return (
      <div className="inpho-container">
        <Controls controls={this.props.controls} />
        <TextComponent
          description="Here you can visualize the philosophy taxonomy with >250 nodes. Or search for concrete topic, its info and its related authors/concepts."
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
            <Button text={message} data="inpho" handleClick={buttonHandler} />
          </>
        ) : null}
      </div>
    );
  }
}

export default InPho;
