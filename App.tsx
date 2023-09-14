import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import TextComponent from "./Components/Text"; // Import your create account component
import Profile from "./Components/Profile"; // Import your Profile component
import LoginComponent from "./Components/Login"; // Import your Login component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TextComponent />} />
        <Route path="/create-account" element={<TextComponent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginComponent />} />
      </Routes>
    </Router>
  );
};

export default App;

// App.js

/* import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import TextComponent from "./Components/Text";
import Profile from "./Components/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<TextComponent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Navigate to="/login.html" />} />
      </Routes>
    </Router>
  );
};

export default App;
 */
