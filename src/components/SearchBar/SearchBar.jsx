import React from "react";
import "./SearchBar.scss";

const SearchBar = props => {
  const preview = props.preview
    ? props.preview.map(prev => {
        return (
          <li key={prev.id} data-id={prev.id} onClick={props.handleOption}>
            {prev.label}
          </li>
        );
      })
    : null;

  return (
    <div className="searchbar-container">
      <form className="searchbar" onSubmit={props.handleSubmit}>
        <input
          type="text"
          onChange={props.handleSearch}
          placeholder="search Philisophy!"
          // value={this.state.toFind}
        />
        <input type="submit" value="search" />
      </form>
      {preview ? (
        <div className="preview-container">
          <ul>{preview}</ul>
        </div>
      ) : null}
    </div>
  );
};
export default SearchBar;
