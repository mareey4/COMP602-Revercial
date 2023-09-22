import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { getProfilePic } from "./validation";
import "./Profile.css";
import "./NavBar.css";
import { useLocation } from "react-router-dom";

function Profile() {
  // State to control the sidebar's open/close status.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // State to store the profile picture URL.
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  // Get the user data from the location state.
  const location = useLocation();
  const user = location.state?.user;

  // Sanitize email and profile picture name for fetching the profile picture.
  const unsanitizedEmail = user.email.replaceAll(",", ".");
  const unsanitizedPFPName = user.profilePic.replaceAll(",", ".");

  // useEffect to load the user's profile picture.
  useEffect(() => {
    async function loadProfilePic() {
      const url = await getProfilePic(unsanitizedEmail, unsanitizedPFPName);
      if (url) {
        setProfilePicUrl(url);
      }
    }

    loadProfilePic();
  }, [unsanitizedEmail, unsanitizedPFPName]);

  // Function to toggle the sidebar open/close status.
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to handle user logout (not fully implemented).
  const handleLogout = () => {
    if (user) {
      user.loginStatus = false; // Update the login status (Note: This might need further implementation).
    }
  }

  const handleEventsLink = () =>{
    navigate("/profile", { state: { user: user } });
  }

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
            <Link to="/create-events" onClick={handleEventsLink}>Create Event</Link>
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <Link to="/Privacy">Privacy Settings</Link>
          </li>
          <li>
            <Link to="/Support">Support Page</Link>
          </li>
          <li>
            <Link to="/Login" onClick={handleLogout}>Log out</Link>{" "}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {profilePicUrl && (
          <div className="profile-info">
            <img src={profilePicUrl} alt="Profile" className="profile-pic" />
            <div className="user-details">
              <p className="user-name">{user.first_name}</p>
              <p className="user-username">@{user.username}</p>
            </div>
          </div>
        )}
        <h1>Profile</h1>
      </div>
    </div>
  );
}

export default Profile;
