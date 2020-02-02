import React, { useEffect } from "react";
import "./Entry.scss";

import Button from "../Button/Button";
import Controls from "../Controls/Controls";
import TextComponent from "../TextComponent/TextComponent";

const Entry = props => {
  useEffect(() => {
    return () => {
      props.toggleLoader();
      console.log("unmount");
    };
  }, []);

  const controls = [
    { name: "info", handler: null, arg: "info" },
    { name: "about", handler: props.changeDisplay, arg: "about" }
  ];
  const description = (
    <>
      <span>H</span>ere you can observe philosophy. This{"\u00A0"}app uses some
      open APIs and parses it to graph which is quite convinient bla bla bla...{" "}
    </>
  );

  return (
    <div className="Entry">
      <Controls controls={controls} />

      <TextComponent
        title="Philosophy map"
        description={description}
        pick="Pick data-source:"
        waiting="data is loading..."
        // isWaiting={isWaiting}
      />

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
