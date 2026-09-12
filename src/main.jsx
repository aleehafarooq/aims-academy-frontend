/* =================================
   APPLY SAVED THEME BEFORE APP LOAD
================================= */

const savedTheme =
  localStorage.getItem("aims_theme");

const initialTheme =
  savedTheme === "dark"
    ? "dark"
    : "light";

document.documentElement.setAttribute(
  "data-theme",
  initialTheme
);

if (initialTheme === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}


/* =================================
   REACT IMPORTS
================================= */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";


/* =================================
   START APPLICATION
================================= */

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <App />
  </StrictMode>
);
