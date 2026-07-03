window.process = process;
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import process from "process";
import { Buffer } from "buffer";

window.Buffer = Buffer; // ✅ fix 3
window.global = window; // ✅ fix 1
window.process = { env: {} }; // ✅ fix 2


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);