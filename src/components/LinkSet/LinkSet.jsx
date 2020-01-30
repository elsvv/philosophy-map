import React from "react";
import "./LinkSet.scss";

import wikiLogo from "../../assets/icons/wiki.png";
import ppLogo from "../../assets/icons/pp.png";
import sepLogo from "../../assets/icons/sep-red.png";

const wikiUrl = "https://en.wikipedia.org/wiki/";
const ppUrl = "https://philpapers.org/s/";
const sepUrl = "https://plato.stanford.edu/entries/";

const LinkSet = props => {
  const wiki = props.wiki ? (
    <a key="1" href={`${wikiUrl}${props.wiki}`} target="_blank">
      <img src={wikiLogo} />
    </a>
  ) : null;
  const pp = props.pp ? (
    <a key="2" href={`${ppUrl}${props.pp}`} target="_blank">
      <img src={ppLogo} />
    </a>
  ) : null;
  const sep = props.sep ? (
    <a key="3" href={`${sepUrl}${props.sep}`} target="_blank">
      <img src={sepLogo} />
    </a>
  ) : null;
  const links = [wiki, pp, sep];

  return <div className="links-set">{links}</div>;
};

export default LinkSet;
