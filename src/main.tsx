import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./router/router";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Main />
  </StrictMode>
);
