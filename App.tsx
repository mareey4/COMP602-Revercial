import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TextComponent from "./Back End/CreateAcc";
import Profile from "./Back End/Profile";
import LoginComponent from "./Back End/Login";
import CreateEvent from "./Back End/CreateEvents";
import Privacy from "./Back End/privacy";
import SupportComponent from "./Back End/Support";
import Joinevents from "./Back End/JoinEvents";

const App = () => {
  return (
    <Router>
      {/* Define the routes for the app */}
      <Routes>
        {/* Route for the sign up page */}
        <Route path="/" element={<TextComponent />} />

        {/* Route for creating a new account */}
        <Route path="/create-account" element={<TextComponent />} />

        {/* Route for user profiles */}
        <Route path="/profile" element={<Profile />} />

        {/* Route for user login */}
        <Route path="/login" element={<LoginComponent />} />

        {/* Route for creating events */}
        <Route path="/create-events" element={<CreateEvent />} />

        <Route path="/join-events/" element={<Joinevents />} />

        {/* Route for privacy settings */}
        <Route path="/privacy" element={<Privacy />} />

        {/* Route for user support */}
        <Route path="/support" element={<SupportComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
