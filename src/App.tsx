import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Guideline, Imprint, Visualization } from './components/';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/defaults" element={<Visualization />} />
        <Route path="/visualize" element={<Visualization />} />
        <Route path="/" element={<Visualization />} />
        <Route path="/guideline" element={<Guideline />} />
        <Route path="/imprint" element={<Imprint />} />
        <Route path="*" element={<Visualization />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
