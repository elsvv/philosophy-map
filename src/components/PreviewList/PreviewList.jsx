import React from "react";

const PreviewList = props => {
  const preview = props.preview
    ? props.preview.map(prev => {
        return (
          <li key={prev.id} data-id={prev.id} onClick={props.handleOption}>
            {prev.label}
          </li>
        );
      })
    : null;

  const nothing = <div className="default">{props.default}</div>;

  if (!preview) {
    return null;
  }

  return (
    <div className="Preview">
      <ul>{preview.length > 0 ? preview : nothing}</ul>
    </div>
  );
};

export default PreviewList;
