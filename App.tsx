import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import TextComponent from "./Components/Text"; // Import your create account component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create-account" element={<TextComponent />} />
        <Route path="/login" element={<Navigate to="/login.html" />} />
      </Routes>
      <TextComponent />
    </Router>
  );
};

export default App;
