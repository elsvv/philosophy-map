import React from "react";
import "./Controls.scss";

const Controls = props => {
  const controls = props.controls.map((control, idx) => {
    return (
      <li
        key={idx}
        className="control"
        onClick={() => control.handler(control.arg)}
      >
        {control.name}
      </li>
    );
  });
  return <ul className="controls-container">{controls}</ul>;
};

export default Controls;
