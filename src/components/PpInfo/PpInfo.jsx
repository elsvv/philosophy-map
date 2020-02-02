import React from "react";

import LinkSet from "../LinkSet/LinkSet";

const PpInfo = props => {
  console.log(props);
  const labelData = props.label.replace(
    /[~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g,
    ""
  );
  const linkData = labelData.replace(/[ ]/g, "-");

  return (
    <div className="PpInfo">
      <LinkSet
        title="Browse more"
        src="pp"
        ppData={{ label: labelData, browse: linkData }}
      />
    </div>
  );
};
export default PpInfo;
