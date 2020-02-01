import React from "react";
import "./LinkSet.scss";

import wikiLogo from "../../assets/icons/wiki.png";
import ppLogo from "../../assets/icons/pp.png";
import sepLogo from "../../assets/icons/sep-red.png";

const wikiUrl = "https://en.wikipedia.org/wiki/";
const ppUrl = "https://philpapers.org/s/";
const sepUrl = "https://plato.stanford.edu/entries/";

const funcLink = (url, entity, logo, id) => {
  if (!entity) {
    return null;
  }
  return (
    <a key={id} href={`${url}${entity}`} target="_blank">
      <img src={logo} />
    </a>
  );
};

const LinkSet = props => {
  const wiki = funcLink(wikiUrl, props.wiki, wikiLogo, 1);
  const pp = funcLink(ppUrl, props.pp, ppLogo, 2);
  const sep = funcLink(sepUrl, props.sep, sepLogo, 3);
  const links = [wiki, pp, sep];

  return <div className="links-set">{links}</div>;
};

export default LinkSet;
