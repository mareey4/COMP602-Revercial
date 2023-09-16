import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./Profile.css";
import "./NavBar.css";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`profile-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar Toggle Button */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <div className={`toggle-lines ${sidebarOpen ? "open" : ""}`}>
          &#9776;
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <h2></h2>
        <ul>
          <li>
            <Link to="/create-events">Create Event</Link>{" "}
            {/* Link to CreateEvents */}
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <Link to="/Login">Log out</Link>{" "}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Profile</h1>
      </div>
    </div>
  );
}

export default Profile;
