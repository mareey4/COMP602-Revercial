/* import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getProfilePic } from "./validation";
import "../Front End/Profile.css";
import "../Front End/NavBar.css";

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
  const unsanitizedEmail = user?.email?.replaceAll(",", ".");
  const unsanitizedPFPName = user?.profilePic?.replaceAll(",", ".");

  // useEffect to load the user's profile picture.
  useEffect(() => {
    async function loadProfilePic() {
      if (unsanitizedEmail && unsanitizedPFPName) {
        const url = await getProfilePic(unsanitizedEmail, unsanitizedPFPName);
        if (url) {
          setProfilePicUrl(url);
        }
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
  };

  const handleEventsLink = () => {
    navigate("/profile", { state: { user: user } });
  };

  return (
    <div className={`profile-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar Toggle Button }
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <div className={`toggle-lines ${sidebarOpen ? "open" : ""}`}>
          &#9776;
        </div>
      </div>

      {/* Sidebar }
      <div className="sidebar">
        <h2></h2>
        <ul>
          <li>
            <Link to="/Create-Events" onClick={handleEventsLink}>
              Create Event
            </Link>
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
            <Link to="/Login" onClick={handleLogout}>
              Log out
            </Link>{" "}
          </li>
        </ul>
      </div>

      {/* Main Content 
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
      </div>
    </div>
  );
}

export default Profile;
 */
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveUserBio, getProfilePic, setProfilePic } from "./validation";
import "../Front End/Profile.css";
import "../Front End/NavBar.css";
import { useLocation } from "react-router-dom";

function Profile() {
  // State to control the sidebar's open/close status.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // State to store the profile picture URL.
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [selectedProfilePic, setSelectedProfilePic] = useState<File | null>(
    null
  );
  const [selectedProfilePicName, setSelectedProfilePicName] = useState<
    string | null
  >(null);
  const profilePicInputRef = useRef<HTMLInputElement | null>(null);

  // Get the user data from the location state.
  const location = useLocation();
  const user = location.state?.user;

  // Sanitize email and profile picture name for fetching the profile picture.
  const unsanitizedEmail = user.email;
  const unsanitizedPFPName = user.profilePic;

  // Add a state variable for the user's bio
  const [bio, setBio] = useState(user.bio || ""); // Initialize with the user's existing bio, if available

  const maxCharacterLimit = 500;

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
  };

  const handleProfilePicChange = () => {
    if (profilePicInputRef.current) {
      profilePicInputRef.current.click();
    }
  };

  const handleProfilePicInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setSelectedProfilePic(file);
      setSelectedProfilePicName(file.name);

      try {
        // Upload the selected profile picture to Firebase Storage
        await setProfilePic(user, file);

        // Set the profilePicUrl to the new URL
        const newUrl = await getProfilePic(user.email, file.name);
        setProfilePicUrl(newUrl);

        // Display a success message
        alert("Profile picture uploaded successfully!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("An error occurred while uploading the profile picture.");
      }
    }
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the bio state when the input changes
    setBio(event.target.value);
  };

  const handleSaveBio = () => {
    // Call the saveUserBio function to save the user's bio
    saveUserBio(user.email, bio);
    alert("Bio saved successfully!");
  };

  const handleEventsLink = () => {
    navigate("/profile", { state: { user: user } });
  };

  const handleJoinEventsLink = (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("Navigating to JoinEvents with user:", user);
    navigate("/join-events", { state: { user: user } });
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
            <a href="#">Settings</a>
          </li>
          <li>
            <Link to="/Privacy">Privacy Settings</Link>
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

      {/* Main Content */}
      <div className="main-content">
        {profilePicUrl && (
          <div className="profile-info">
            <label htmlFor="profile-pic" onClick={handleProfilePicChange}>
              <img
                src={profilePicUrl || "default-profile-picture-url"}
                alt="Profile"
                className="profile-pic"
              />
            </label>
            <input
              ref={profilePicInputRef}
              type="file"
              id="profile-pic"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfilePicInputChange}
            />
            <div className="user-details">
              <p className="user-name">{user.first_name}</p>
              <p className="user-username">@{user.username}</p>
            </div>
          </div>
        )}

        <h1>Profile</h1>
        <div className="bio-section">
          <h2>Bio</h2>
          <textarea
            className="bio-textarea"
            value={bio}
            onChange={handleBioChange}
            placeholder="Type your bio here"
            maxLength={maxCharacterLimit} // Set the maximum character limit
          />
          <div className="char-counter">
            Charcter Count: {bio.length}/{maxCharacterLimit}
          </div>
          <button onClick={handleSaveBio}>Save Bio</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
