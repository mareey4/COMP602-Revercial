import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Front End/NavBar.css";
import "../Front End/CreateEvents.css";
import { getDatabase, ref, set } from "firebase/database";
import { fbConfig } from "./firebase";
import { generateTicketID } from "./TicketGenerator";
import {
  getCurrentDate,
  validateAddress,
  validateDescription,
  isFutureDate,
} from "./validation";

function CreateEvents() {
  // State for sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // State for selected event type and step in event creation
  const [selectedEventType, setSelectedEventType] = useState("");
  const [step, setStep] = useState(1);

  // State for event details, button states, and address validation
  const [eventDetails, setEventDetails] = useState({
    date: "",
    location: "",
    description: "",
  });
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true); // State for disabling the "Continue" button
  const [addressValid, setAddressValid] = useState(true);

  // Array of event choices
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

  // Event type change handler
  const handleEventTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedEventType(event.target.value);
  };

  // Event creation handler
  const handleCreateEvent = async () => {
    // Check for incomplete event details
    console.log("Handle Create Event function called!");
    if (
      !eventDetails.date ||
      !eventDetails.location ||
      !eventDetails.description
    ) {
      alert("Please fill in all event details.");
      return;
    }

    // Validate address
    const isValidAddress = validateAddress(eventDetails.location);
    if (!isValidAddress) {
      alert("Invalid address. Special characters are not allowed.");
      return;
    }

    // Validate description length
    const isValidDescription = validateDescription(eventDetails.description);
    if (!isValidDescription) {
      alert("Description exceeds more than 100 characters");
      return;
    }

    try {
      // Generate a unique ticket ID
      const ticketID = await generateTicketID();

      const eventDetailsWithTicketID = {
        ...eventDetails,
        ticketID: ticketID,
      };

      // Access Firebase database
      const db = getDatabase();
      const eventTypePath = selectedEventType.replace(/ /g, "_");
      const eventPath = `Events/${eventTypePath}/${ticketID}`;
      const eventRef = ref(db, eventPath);

      // Set event details in the database
      set(eventRef, eventDetailsWithTicketID);

      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event: ", error);
      alert("An error occurred while creating the event. Please try again.");
    }
  };

  // Input change handler for event details
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setEventDetails({
      ...eventDetails,
      [name]: value,
    });

    if (name === "location") {
      const isValid = validateAddress(value);
      setAddressValid(isValid);
    } else if (name === "date") {
      const isValidDateValue = isFutureDate(value);
      if (!isValidDateValue) {
        alert("Invalid date. Please select a future date.");
      }
      setContinueButtonDisabled(!isValidDateValue || !addressValid);
    }
  };

  // Back button handler
  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    // Navigation bar and JSX component with steps to create the event
    <div className={`body ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <div className={`toggle-lines ${sidebarOpen ? "open" : ""}`}>
          &#9776;
        </div>
      </div>
      <div className="sidebar">
        <h2></h2>
        <ul>
          <li>
            <Link to="/Profile">Profile</Link>
          </li>
          <li>
            <Link to="/create-events">Create Event</Link>{" "}
          </li>
          <li>
            <Link to="/privacy">Settings</Link>
          </li>
          <li>
            <Link to="/Support">Support</Link>
          </li>
          <li>
            <Link to="/Login">Log out</Link>{" "}
          </li>
        </ul>
      </div>
      <div className="wrapper">
        <h1>Create an Event</h1>
      </div>

      <div className="wrapper-h1">
        {step === 1 && (
          <>
            <h2 style={{ color: "#fff" }}>
              What type of event are you planning?
            </h2>
            <select value={selectedEventType} onChange={handleEventTypeChange}>
              <option value="">Select an event type</option>
              {eventChoices.map((event, index) => (
                <option key={index} value={event}>
                  {event}
                </option>
              ))}
            </select>
            <div className="create-button-container">
              <button
                className="create-button"
                onClick={() => setStep(2)}
                disabled={!selectedEventType}
              >
                Continue
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 style={{ color: "#fff" }}>When is the event?</h2>
            <input
              type="date"
              name="date"
              value={eventDetails.date}
              onChange={handleInputChange}
              min={getCurrentDate()}
            />

            <div className="create-button-container">
              <button
                className="create-button back-button"
                onClick={handleBack}
              >
                Back
              </button>
              <button className="create-button" onClick={() => setStep(3)}>
                Continue
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 style={{ color: "#fff" }}>Where is the event?</h2>
            <input
              type="text"
              name="location"
              value={eventDetails.location}
              onChange={handleInputChange}
              placeholder="Enter location..."
            />
            <div className="create-button-container">
              <button
                className="create-button back-button"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="create-button"
                onClick={() => setStep(4)}
                disabled={!eventDetails.location || !addressValid}
              >
                Continue
              </button>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h2 style={{ color: "#fff" }}>
              Describe your event (max 500 characters)
            </h2>
            <textarea
              name="description"
              value={eventDetails.description}
              onChange={handleInputChange}
              maxLength={501}
              rows={5}
              style={{ width: "92%", height: "200px" }}
            />
            <div className="create-button-container">
              <button
                className="create-button back-button"
                onClick={handleBack}
              >
                Back
              </button>{" "}
              <button
                className="create-button"
                onClick={handleCreateEvent}
                disabled={!eventDetails.description}
              >
                Create Event
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateEvents;
