import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Index } from "./components";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(createElement(Index));
}
