import React from "react";
import "./Colors.scss";

import Controls from "../Controls/Controls";

const rowFunc = colorList => {
  let renderColors = [];
  let row = [];

  for (let i in colorList) {
    if (i % 2 == 0 && i != 0) {
      renderColors.push(
        <div className="row" key={i}>
          {[...row]}
        </div>
      );
      row = [];
    }
    let item = (
      <div className="color-item" key={i}>
        <div
          key={i}
          className="color-circle"
          style={{ backgroundColor: colorList[i].color }}
        ></div>
        <p className="color-text">{colorList[i].label}</p>
      </div>
    );
    row.push(item);
    if (i == colorList.length - 1) {
      renderColors.push(
        <div className="row" key={i}>
          {[...row]}
        </div>
      );
    }
  }
  return renderColors;
};

const Colors = props => {
  const controls = [
    { name: "hide", handler: props.infoToggle, arg: false },
    { name: "back", handler: props.colorsHandler, arg: false }
  ];

  const thinkerColors = [
    { label: "influenced", color: "#EC8584" },
    { label: "influenced by", color: "#8FBBFF" },
    { label: "related ideas", color: "#FFFE54" },
    { label: "influenced and influenced by", color: "#DDFFC3" }
  ];
  const ideaColors = [
    { label: "occurrences", color: "#FFCEAB" },
    { label: "related thinkers", color: "#E37CF9" },
    { label: "occurrences and hyponyms", color: "#F3AB3E" },
    { label: "hyponyms", color: "#6C71F4" },
    { label: "occurrences, hyponyms and instances", color: "#00F0FF" },
    { label: "hyponymss and instances", color: "#458900" },
    { label: "occurrences and instances", color: "#FFFCB2" },
    { label: "instances", color: "#FFD4F1" }
  ];

  const renderColors =
    props.type === "thinker" ? rowFunc(thinkerColors) : rowFunc(ideaColors);

  return (
    <div className="InfoContainer">
      <Controls controls={controls} />
      <div className="colors-legend">{renderColors}</div>
    </div>
  );
};

export default Colors;
