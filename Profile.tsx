import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfilePic } from "./validation";
import "./Profile.css";
import "./NavBar.css";
import { useLocation } from "react-router-dom";

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
            <Link to="/create-events">Create Event</Link>
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
