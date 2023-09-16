import React, { useState } from "react";
import "./Profile.css";

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
            <a href="#">Create Event</a>
          </li>
          <li>
            <a href="#">Settings</a>
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
