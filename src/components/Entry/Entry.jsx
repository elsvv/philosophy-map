import React from "react";
import "./Entry.scss";

import Button from "../Button/Button";

const Entry = props => {
  return (
    <div className="Entry">
      <div className="title-container">
        <h1 className="title">Philisophy map</h1>
        <p className="text">
          <span>H</span>ere you can observe philosophy. This{"\u00A0"}app uses
          some open APIs and parses it to graph which is quite convinient bla
          bla bla...{" "}
        </p>
        <p className="pick">Pick data-source:</p>
      </div>
      <div className="button-set">
        <Button
          text="PhilPapers.org API"
          data="philpapers"
          handleClick={props.changeDisplay}
        />
        <div id="disabled" style={{ backgroundColor: "#ccc" }}>
          <Button text="InPhOproject.org API" />
        </div>
      </div>
    </div>
  );
};
export default Entry;
