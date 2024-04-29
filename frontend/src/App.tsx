import { BrowserRouter, Route, Routes } from "react-router-dom";
import VisualizationComp from "./components/VisualizationComp";

import "./App.css";
import GuidelineComp from "./components/Guideline";
import ImprintComp from "./components/Imprint";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/defaults" element={<VisualizationComp />} />
        <Route path="/visualize" element={<VisualizationComp />} />
        <Route path="/" element={<VisualizationComp />} />
        <Route path="/guideline" element={<GuidelineComp />} />
        <Route path="/imprint" element={<ImprintComp />} />
        <Route path="*" element={<VisualizationComp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
