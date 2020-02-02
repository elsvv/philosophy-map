import React from "react";
import "./LinkSet.scss";

import wikiLogo from "../../assets/icons/wiki.png";
import ppLogo from "../../assets/icons/pp.png";
import sepLogo from "../../assets/icons/sep-red.png";

const wikiUrl = "https://en.wikipedia.org/wiki/";
const ppUrl = "https://philpapers.org/s/";
const sepUrl = "https://plato.stanford.edu/entries/";

const ppBrowseUrl = "https://philpapers.org/browse/";
const sepBrowseUrl = "https://plato.stanford.edu/search/searcher.py?query=";

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
  let links;

  if (props.src === "pp") {
    const ppBrowse = funcLink(ppBrowseUrl, props.ppData.browse, ppLogo, 1);
    const sepBrowse = funcLink(sepBrowseUrl, props.ppData.label, sepLogo, 2);

    links = [ppBrowse, sepBrowse];
  } else {
    const wiki = funcLink(wikiUrl, props.wiki, wikiLogo, 1);
    const pp = funcLink(ppUrl, props.pp, ppLogo, 2);
    const sep = funcLink(sepUrl, props.sep, sepLogo, 3);

    links = [pp, sep, wiki];
  }

  return (
    <div className="links-container">
      <h4>{props.title}</h4>
      <div className="links-set">{links}</div>
    </div>
  );
};

export default LinkSet;
