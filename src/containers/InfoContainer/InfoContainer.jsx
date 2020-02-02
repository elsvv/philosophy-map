import React, { useState } from "react";
import "./InfoContainer.scss";

import Controls from "../../components/Controls/Controls";
import ThinkerInfo from "../../components/ThinkerInfo/ThinkerInfo";
import IdeaInfo from "../../components/IdeaInfo/IdeaInfo";
import PpInfo from "../../components/PpInfo/PpInfo";
import Colors from "../../components/Colors/Colors";

const InfoContainer = props => {
  let [isColors, setIsColors] = useState(false);

  const colorsHandler = bool => {
    setIsColors(bool);
  };

  const { label, type } = props.selectedData;
  const controls =
    type != undefined
      ? [
          { name: "hide", handler: props.infoToggle, arg: false },
          { name: "colors", handler: colorsHandler, arg: true }
        ]
      : [{ name: "hide", handler: props.infoToggle, arg: false }];

  if (isColors) {
    return (
      <Colors
        type={type}
        colorsHandler={colorsHandler}
        infoToggle={props.infoToggle}
      />
    );
  }

  const inpho =
    type == "thinker" ? (
      <ThinkerInfo {...props.selectedData} />
    ) : (
      <IdeaInfo {...props.selectedData} />
    );
  const pp = <PpInfo label={label} />;

  return (
    <div className="InfoContainer">
      <Controls controls={controls} />
      <div className="info">
        <h2>{label}</h2>
        {type != undefined ? inpho : pp}
      </div>
    </div>
  );
};

export default InfoContainer;
