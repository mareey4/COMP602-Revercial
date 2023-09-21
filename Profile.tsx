import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // Import Link from React Router
import { getProfilePic } from "./validation";
import "./Profile.css";
import "./NavBar.css";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const location = useLocation();
  const user = location.state?.user;
  const unsanitizedEmail = user.email.replaceAll(",", ".");
  const unsanitizedPFPName = user.profilePic.replaceAll(",", ".");

  useEffect(() => {
    async function loadProfilePic() {
      const url = await getProfilePic(unsanitizedEmail, unsanitizedPFPName);
      if (url) {
        setProfilePicUrl(url);
      }
    }

    loadProfilePic();
  }, [unsanitizedEmail, unsanitizedPFPName]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () =>{
    if (user) {
      user.loginStatus = false;
    }
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
            <Link to="/create-events">Create Event</Link>{" "}
            {/* Link to CreateEvents */}
          </li>
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <Link to="/Privacy">Privacy Settings</Link>
          </li>
          <li>
            <Link to="/Login" onClick={handleLogout}>Log out</Link>{" "}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Profile</h1>

        {/* Display the profile picture */}
        {profilePicUrl && (
          <img src={profilePicUrl} alt="Profile" className="profile-pic" />
        )}
      </div>
    </div>
  );
}

export default Profile;
