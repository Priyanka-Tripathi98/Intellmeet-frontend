window.process = process;
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import process from "process";
import { Buffer } from "buffer";
import emailjs from '@emailjs/browser';

window.Buffer = Buffer;
window.global = window;
window.process = { env: {} };
emailjs.init("vG69igiSI3mR8BND-");

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);