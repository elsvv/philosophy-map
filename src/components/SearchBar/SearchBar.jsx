import React from "react";
import "./SearchBar.scss";

import PreviewList from "../PreviewList/PreviewList";
import searchIcon from "../../assets/icons/search.svg";

const SearchBar = props => {
  return (
    <div className="searchbar-container">
      <form className="searchbar" onSubmit={props.handleSubmit}>
        <input
          type="text"
          onChange={props.handleSearch}
          placeholder="Kant, logic or feminism"
          // value={this.state.toFind}
        />
        <button type="submit">
          <img src={searchIcon} />
        </button>
      </form>
      <PreviewList
        default={"Nothing found..."}
        handleOption={props.handleOption}
        preview={props.preview}
      />
    </div>
  );
};
export default SearchBar;
