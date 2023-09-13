import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import TextComponent from "./Components/Text"; // Import your create account component
import LoginComponent from "./Components/Login"; // Import your Login component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TextComponent />} />
        <Route path="/create-account" element={<TextComponent />} />
        <Route path="/login" element={<LoginComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
