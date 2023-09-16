import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import "./CreateEvents.css";

function CreateEvents() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [selectedEventType, setSelectedEventType] = useState("");
  const eventChoices = [
    "Gala",
    "Meeting",
    "Networking",
    "Non-Profit Event",
    "Open House",
    "Party",
    "Professional Event",
    "Reunion",
    "Sporting Event",
    "Trip",
    "Wedding",
    "Workshop",
    "Other",
  ];

  const handleEventTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedEventType(event.target.value);
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
            <Link to="/Profile">Profile</Link>
          </li>
          <li>
            <Link to="/create-events">Create Event</Link>
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
        <h1>Create an Event</h1>
      </div>
      {/* Event Type Selection Section */}
      <div>
        <h2>What type of event are you planning?</h2>
        <select value={selectedEventType} onChange={handleEventTypeChange}>
          <option value="">Select an event type</option>
          {eventChoices.map((event, index) => (
            <option key={index} value={event}>
              {event}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            // Handle the "Continue" button click here
            // You can perform actions based on the selected event type
            // For example, you can navigate to the next step or perform validation
            alert(`Selected event type: ${selectedEventType}`);
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default CreateEvents;
