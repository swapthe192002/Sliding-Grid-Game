import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Puzzle from "./components/Puzzle";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/puzzle/:id" element={<Puzzle />} />
      </Routes>
    </Router>
  );
}

export default App;
