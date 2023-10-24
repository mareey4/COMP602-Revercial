// Import necessary modules and components
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import Events from "./Events";

// Define the CreateEvents component
function CreateEvents() {
  // Initialize React Router's navigation function
  const navigate = useNavigate();

  // State for sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // List of available event choices
  const eventChoices = [
    "Gala", "Meeting", "Networking", "Non-Profit Event", "Open House",
    "Party", "Professional Event", "Reunion", "Sporting Event", "Trip",
    "Wedding", "Workshop", "Other",
  ];

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
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);
  const [addressValid, setAddressValid] = useState(true);

  // State for the created event
  const [createdEvent, setCreatedEvent] = useState<Events | null>(null);
  const location = useLocation();
  const user = location.state?.user;

  // Function to handle navigation to the user's profile
  const handleProfileLink = async () => {
    navigate("/profile", { state: { user: user } });
  };

  // Event type change handler
  const handleEventTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedEventType(event.target.value);
  };

  // Event creation handler
  const handleCreateEvent = async () => {
    // Check for incomplete event details
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
      const ticketID = await generateTicketID("Events", undefined);

      // Create a new event object
      const newEvent = new Events(
        eventDetails.date,
        eventDetails.description,
        eventDetails.location,
        ticketID,
        selectedEventType
      );
      newEvent.eventType = selectedEventType;

      // Access Firebase database
      const db = getDatabase(fbConfig);
      const eventTypePath = selectedEventType.replace(/ /g, "_");
      const eventPath = `Events/${eventTypePath}/${ticketID}`;
      const eventRef = ref(db, eventPath);

      // Set event details in the database
      set(eventRef, newEvent);

      // Store the created event in state
      setCreatedEvent(newEvent);

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

  // Function to handle navigation to the user's events
  const handleEventsLink = () => {
    navigate("/profile", { state: { user: user } });
  };

  // Function to handle navigation to join events (prevents default link behavior)
  const handleJoinEventsLink = (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("Navigating to JoinEvents with user:", user);
    navigate("/join-events", { state: { user: user } });
  };

  // Function to handle user logout (not fully implemented)
  const handleLogout = () => {
    if (user) {
      user.loginStatus = false; // Update the login status (Note: This might need further implementation).
    }
  };

  return (
    // JSX component with steps to create the event
    <div className={`body ${sidebarOpen ? "sidebar-open" : ""}`}>
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
            <Link to="/profile" onClick={handleProfileLink}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/create-events" onClick={handleEventsLink}>
              Create Event
            </Link>
          </li>
          <li>
            <Link to="/join-events" onClick={handleJoinEventsLink}>
              Join Events{" "}
            </Link>
          </li>
          <li>
            <Link to="/Support">Support Page</Link>
          </li>
          <li>
            <Link to="/Login" onClick={handleLogout}>
              Log out
            </Link>{" "}
          </li>
        </ul>
      </div>

      <div className="wrapper">
        <h1>Create an Event</h1>

        <div className="wrapper-h1">
          {step === 1 && (
            <>
              <h2 style={{ color: "#293728" }}>
                What type of event are you planning?
              </h2>
              <select
                value={selectedEventType}
                onChange={handleEventTypeChange}
              >
                <option value="">Select an event type</option>
                {eventChoices.map((event, index) => (
                  <option key={index} value={event
