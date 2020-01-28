import React, { Component } from "react";
import "./ThinkerInfo.scss";

const ThinkerInfo = props => {
  const { birth_strings, death_strings, nationalities, professions } = props;

  return (
    <div className="ThinkerInfo">
      <dl className="biography">
        <div className="birth-date">
          <dt>Birth date:{"\u00A0"}</dt>
          <dd>{birth_strings}</dd>
        </div>
        <div className="death-date">
          <dt>Death date:{"\u00A0"}</dt>
          <dd>{death_strings}</dd>
        </div>
        <div className="nationalities">
          <dt>Nationalities:{"\u00A0"}</dt>
          <dd>{nationalities}</dd>
        </div>
        <div className="professions">
          <dt>Professions:{"\u00A0"}</dt>
          <dd>{professions.join(", ")}</dd>
        </div>
      </dl>
    </div>
  );
};

export default ThinkerInfo;
