import React from "react";

import Controls from "../Controls/Controls";
import TextComponent from "../TextComponent/TextComponent";

const About = props => {
  const description = (
    <>
      <span>H</span>ABOUT This{"\u00A0"}app uses some oABOUT{" "}
    </>
  );

  return (
    <div className="About">
      <Controls controls={props.controls} />

      <TextComponent
        title="Philosophy map"
        description={description}
        pick="Pick data-source:"
        waiting="data is loading..."
        // isWaiting={isWaiting}
      />
    </div>
  );
};
export default About;
