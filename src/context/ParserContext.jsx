import { createContext } from "react";

function func() {}

const ParserContext = createContext({
  nodes: null,
  edges: null,
  isLoaded: false
});

export default ParserContext;
