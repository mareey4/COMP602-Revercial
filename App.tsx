import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TextComponent from "./Back End/Text"; // Import your create account component
import Profile from "./Back End/Profile"; // Import your Profile component
import LoginComponent from "./Back End/Login"; // Import your Login component
import CreateEvent from "./Back End/CreateEvents"; // Import your CreateEvent component
import Privacy from "./Back End/privacy"; // Import your Privacy component
import SupportComponent from "./Back End/Support"; // Import your Support component

const App = () => {
  return (
    <Router>
      {/* Define the routes for your application */}
      <Routes>
        {/* Route for the root path (e.g., your homepage) */}
        <Route path="/" element={<TextComponent />} />

        {/* Route for creating a new account */}
        <Route path="/create-account" element={<TextComponent />} />

        {/* Route for user profiles */}
        <Route path="/profile" element={<Profile />} />

        {/* Route for user login */}
        <Route path="/login" element={<LoginComponent />} />

        {/* Route for creating events */}
        <Route path="/create-events" element={<CreateEvent />} />

        {/* Route for privacy settings */}
        <Route path="/privacy" element={<Privacy />} />

        {/* Route for user support */}
        <Route path="/support" element={<SupportComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
