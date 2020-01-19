import React from "react";

const SearchBar = props => (
  <div>
    <form onSubmit={props.handleSubmit}>
      <input
        type="text"
        onChange={props.handleSearch}
        placeholder="search Philisophy!"
        // value={this.state.toFind}
      />
      <input type="submit" />
    </form>
  </div>
);

export default SearchBar;
