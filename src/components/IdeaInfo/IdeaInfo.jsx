import React, { Component } from "react";

import LinkSet from "../LinkSet/LinkSet";

const IdeaInfo = props => {
  const {
    // birth_strings,
    // death_strings,
    // nationalities,
    // professions,
    // wiki,
    sep_dir,
    label
  } = props;

  return (
    <div className="IdeaInfo">
      <LinkSet title="Read more:" wiki={label} pp={label} sep={sep_dir} />
    </div>
  );
};

export default IdeaInfo;
