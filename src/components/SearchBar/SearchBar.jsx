import React from "react";
import "./SearchBar.scss";

import PreviewList from "../PreviewList/PreviewList";

const SearchBar = props => {
  return (
    <div className="searchbar-container">
      <form className="searchbar" onSubmit={props.handleSubmit}>
        <input
          type="text"
          onChange={props.handleSearch}
          placeholder="Kant, logic or China"
          // value={this.state.toFind}
        />
        <input type="submit" value="search" />
      </form>
      <PreviewList handleOption={props.handleOption} preview={props.preview} />
    </div>
  );
};
export default SearchBar;
