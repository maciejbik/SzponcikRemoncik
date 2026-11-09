import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import "@fontsource-variable/montserrat";
import "./index.css";
import Landing from "./pages/Landing";
import Prototype from "./pages/Prototype";
import ScrollToTop from "./components/ScrollToTop";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Prototype />} />      </Routes>
    </HashRouter>
  </StrictMode>,
);
