import React from "react";
import "./TextComponent.scss";

const TextComponent = props => {
  const description = props.description ? (
    <div className="description">{props.description}</div>
  ) : null;

  return (
    <div className="text-container">
      <h1 className="title">{props.title}</h1>
      {description}
      {props.isWaiting ? (
        <p className="waiting">{props.waiting}</p>
      ) : (
        <p className="pick">{props.pick}</p>
      )}
    </div>
  );
};
export default TextComponent;
