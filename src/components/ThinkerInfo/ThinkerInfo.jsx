import React from "react";
import "./ThinkerInfo.scss";

import LinkSet from "../LinkSet/LinkSet";

const ThinkerInfo = props => {
  const {
    birth_strings,
    death_strings,
    nationalities,
    professions,
    wiki,
    sep_dir,
    label
  } = props;

  return (
    <div className="ThinkerInfo">
      <dl className="biography">
        {birth_strings != "" ? (
          <div className="birth-date">
            <dt>Birth date:{"\u00A0"}</dt>
            <dd>{birth_strings}</dd>
          </div>
        ) : null}
        {death_strings != "" ? (
          <div className="death-date">
            <dt>Death date:{"\u00A0"}</dt>
            <dd>{death_strings}</dd>
          </div>
        ) : null}
        {nationalities != "" ? (
          <div className="nationalities">
            <dt>Nationalities:{"\u00A0"}</dt>
            <dd>{nationalities.join(", ")}</dd>
          </div>
        ) : null}
        {professions != "" ? (
          <div className="professions">
            <dt>Professions:{"\u00A0"}</dt>
            <dd>{professions.join(", ")}</dd>
          </div>
        ) : null}
      </dl>
      <LinkSet title="Read more:" wiki={wiki} pp={label} sep={sep_dir} />
    </div>
  );
};

export default ThinkerInfo;
