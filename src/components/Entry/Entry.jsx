import React, { useEffect } from "react";
import "./Entry.scss";

import Button from "../Button/Button";

const Entry = props => {
  useEffect(() => {
    return () => {
      props.toggleLoader();
      console.log("unmount");
    };
  }, []);

  return (
    <div className="Entry">
      <div className="text-container">
        <h1 className="title">Philosophy map</h1>
        <p className="text">
          <span>H</span>ere you can observe philosophy. This{"\u00A0"}app uses
          some open APIs and parses it to graph which is quite convinient bla
          bla bla...{" "}
        </p>
        <p className="pick">Pick data-source:</p>
      </div>
      <div className="button-set">
        <Button
          text="InPho project API"
          data="inpho"
          handleClick={props.changeDisplay}
        />
        <Button
          text="PhilPapers.org API"
          data="philpapers"
          handleClick={props.changeDisplay}
        />
      </div>
    </div>
  );
};
export default Entry;
