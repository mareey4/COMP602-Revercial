import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { getDatabase, ref, get, onValue, set } from "firebase/database";
import { fbConfig } from "./firebase";
import Events from "./Events";
import { getUserViaEmail, getProfilePic } from "./validation";
import "../Front End/JoinEvents.css";

// Define types for Event and UserProfile
type Event = InstanceType<typeof Events>;
type UserProfileType = {
  profilePic?: string;
  username?: string;
};

function Joinevents() {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>();
  const [userProfile, setUserProfile] = useState<UserProfileType>({});
  const [joinedUser, setJoinedUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  console.log("Location object:", location);
  console.log("User:", user);
  // Logging the user and user data when the component mounts
  useEffect(() => {
    console.log("JoinEvents mounted with user:", user);
  }, []);
  // State to store the list of events
  const [eventList, setEventList] = useState<Event[]>([]);

  // Function to handle clicking on an event
  const handleEventClick = async (event: Event) => {
    console.log("Event clicked:", event);
    setSelectedEvent(event);
    if (user && user.email) {
      const userData = await getUserViaEmail(user.email);

      if (userData) {
        setUserProfile({
          profilePic: userData.profilePic,
          username: userData.username,
        });
      }
    }

    setShowPopUp(true);
  };

  // Fetch events from Firebase and store them in eventList
  useEffect(() => {
    const db = getDatabase(fbConfig);
    const eventRef = ref(db, `Events`);

    onValue(eventRef, (snapshot) => {
      const eventsData = snapshot.val();
      const eventList: Event[] = [];

      for (const eventType in eventsData) {
        const events = Object.values(eventsData[eventType]) as {
          date: string;
          description: string;
          location: string;
          ticketID: string;
          username: string;
          joinedUsers?: any[];
        }[];
        for (const event of events) {
          const eventInstance = new Events(
            event.date,
            event.description,
            event.location,
            event.ticketID,
            eventType,
            event.username,
            event.joinedUsers || []
          );
          eventList.push(eventInstance);
        }
      }

      setEventList(eventList);
    });

    console.log("Event List:", eventList);
  }, []);

  useEffect(() => {
    console.log("userProfile:", userProfile);
  }, [userProfile]);

   // Function to handle user logout
  const handleLogout = () => {
    if (user) {
      user.loginStatus = false;
    }
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to navigate to the create events page
  const handleEventsLink = () => {
    navigate("/create-events", { state: { user: user } });
  };

  // Function to navigate to the profile page
  const handleProfileLink = async () => {
    navigate("/profile", { state: { user: user } });
  };

  const handleJoinEvent = async () => {
    const userData = await getUserViaEmail(user.email);

    if (!user || !user.email) {
      console.error("User or user email is not available");
      return;
    }

    if (selectedEvent && user && userData) {
      if (!selectedEvent.joinedUsers) {
        selectedEvent.joinedUsers = [];
      }
      selectedEvent.joinedUsers.push({
        profilePic: userData.profilePic,
        username: userData.username,
      });

      setShowPopUp(false);
    } else {
      console.log("User data or selected event not found in the database.");
    }
  };

  // Function to close the popup
  const closePopUp = () => {
    setShowPopUp(false);
  };

  // Function to check if the user has already joined an event
  const hasUserJoinedEvent = (event: Event, username: string): boolean => {
    return event.joinedUsers.some((user) => user.username === username);
  };

  const handleLeaveEvent = async () => {
    if (!user || !user.email || !selectedEvent) {
      console.error("User, user email, or selected event is not available");
      return;
    }

    const index = selectedEvent.joinedUsers.findIndex(
      (joinedUser) => joinedUser.username === user.username
    );

    if (index !== -1) {
      selectedEvent.joinedUsers.splice(index, 1);
    }

    for (let key in selectedEvent) {
      if ((selectedEvent as any)[key] === undefined) {
        console.log(`Property ${key} is undefined. Setting to default value.`);
        (selectedEvent as any)[key] = "";
      }
    }

    const db = getDatabase(fbConfig);
    const eventRef = ref(
      db,
      `Events/${selectedEvent.eventType}/${selectedEvent.ticketID}`
    );
    set(eventRef, selectedEvent)
      .then(() => {
        console.log("User successfully left the event");
      })
      .catch((error) => {
        console.error("Error updating the event in Firebase:", error);
      });

    setShowPopUp(false);
  };

  // Function to navigate to the join events page
  const handleJoinEventsLink = (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("Navigating to JoinEvents with user:", user);
    navigate("/join-events", { state: { user: user } });
  };

  return (
    <div>
      <div className="container">
        <div className="container h1">
          {" "}
          <h1>Join an Event</h1>
          <div className="event-grid">
            {eventList.map((event, index) => (
              <div
                key={index}
                className="event"
                onClick={() => handleEventClick(event)}
              >
                <h2>{event.eventType}</h2>
              </div>
            ))}
          </div>
        </div>

        {showPopUp && (
          <div className="popup-container">
            <div className="popup-form">
              <p>Date: {selectedEvent?.date}</p>
              <p>Location: {selectedEvent?.location}</p>
              <p>Description: {selectedEvent?.description}</p>
              <div className="joined-users">
                <div className="joined-users">
                  <h3>Joined Users:</h3>
                  {selectedEvent?.joinedUsers.map((user, idx) => (
                    <div key={idx} className="joined-user">
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="joined-user-pic"
                      />
                      <p>@{user.username ? user.username : "No Username"}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="popup-close-button">
                <button onClick={closePopUp}>x</button>
              </div>
              <div className="popup-join-button">
                {selectedEvent &&
                  userProfile.username &&
                  !hasUserJoinedEvent(selectedEvent, userProfile.username) && (
                    <button onClick={handleJoinEvent}>Join</button>
                  )}
                {selectedEvent &&
                  userProfile.username &&
                  hasUserJoinedEvent(selectedEvent, userProfile.username) && (
                    <button
                      onClick={handleLeaveEvent}
                      className="leave-event-btn"
                    >
                      Leave
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}
        <div
          className={`profile-container ${sidebarOpen ? "sidebar-open" : ""}`}
        >
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
        </div>
      </div>
    </div>
  );
}

export default Joinevents;
