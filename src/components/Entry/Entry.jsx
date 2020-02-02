import React, { useEffect, useState } from "react";
import "./Entry.scss";

import Button from "../Button/Button";
import Controls from "../Controls/Controls";
import TextComponent from "../TextComponent/TextComponent";

const Entry = props => {
  let [about, setAbout] = useState(false);

  const toggleAbout = () => {
    setAbout(!about);
  };

  useEffect(() => {
    return () => {
      props.toggleLoader();
    };
  }, []);

  const controls = [{ name: "about", handler: toggleAbout, arg: "about" }];
  const description = (
    <>
      <p>
        <span>H</span>ere you can observe philosophy. This{"\u00A0"}app uses
        some open APIs and parses it to a graph. Inspect nodes' connections and
        continue your research with Stanford{"\u00A0"}Encyclopedia{"\u00A0"}of
        {"\u00A0"}Philosophy / PhilPapers / Wiki articles further.
      </p>
      <p className="italic">Double-click on any node to see details.</p>
    </>
  );

  const aboutDescription = (
    <>
      <span>T</span>his project visualizes a philosophy taxonomy into a large
      graph. It uses{" "}
      <a href="https://philpapers.org/help/api/" target="blank">
        PhilPapers
      </a>{" "}
      and{" "}
      <a href="https://www.inphoproject.org/docs/" target="blank">
        InPhO
      </a>{" "}
      opened RESTful APIs. The code is written on ReactJS. All visualization is
      made with vis.js library. Source code may be found on{" "}
      <a href="https://github.com/elisalech/philosophy-map" target="blank">
        github
      </a>
      . If there are any questions / thoughts, you can write me a message on
      email or open an issue on github. <br />
      Thanks{"\u00A0"}to{"\u00A0"}
      <a href="https://semilunar.github.io/" target="blank">
        semilunar
      </a>{" "}
      for useful design advices!
      <div className="footer">
        <p id="me">Eliseev Viacheslav</p>
        <p id="email">
          <a href="mailto:elis.alech900@gmail.com">elis.alech900@gmail.com</a>
        </p>
      </div>
    </>
  );

  const entryPage = (
    <>
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
    </>
  );

  const aboutPage = (
    <div className="about">
      <TextComponent title="About this app" description={aboutDescription} />
    </div>
  );

  return (
    <div className="Entry">
      <Controls controls={controls} />
      {(about && aboutPage) || entryPage}
    </div>
  );
};
export default Entry;
