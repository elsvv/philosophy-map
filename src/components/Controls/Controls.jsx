import React from "react";
import "./Controls.scss";

const Controls = props => {
  const controls = props.controls.map((control, idx) => {
    return (
      <div
        key={idx}
        className={`control ${control.name}`}
        onClick={() => control.handler(control.arg)}
      ></div>
    );
  });
  return <div className="controls-container">{controls}</div>;
};

export default Controls;
