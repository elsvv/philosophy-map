import React from "react";
import "./App.css";
import Parser from "./containers/Parser/Parser";
import axios from "axios";

// const csrfToken = document.querySelector("meta[name=csrf-token]").content;
// axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

function App() {
  return (
    <div className="App">
      <Parser />
    </div>
  );
}

export default App;
