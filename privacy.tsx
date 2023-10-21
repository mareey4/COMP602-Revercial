import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "../Front End/privacy.css";
import "../Front End/NavBar.css";

function Privacy() {
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
            <Link to="/Privacy">Privacy Settings</Link>
          </li>
          <li>
            <Link to="/Login">Log out</Link>{" "}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div>
        <header className="header">
          <h1 className="header__title">Profile Privacy Settings</h1>
          <p className="header__description">
            Welcome to your account privacy settings!
          </p>
        </header>

        <section className="privacy-options">
          <h2 className="privacy-options__title">Privacy Options</h2>
          <div className="privacy-container">
            <form action="#" method="POST">
              <div className="privacy-option">
                <label
                  htmlFor="profileVisibility"
                  className="privacy-option__label"
                >
                  Profile Visibility:
                </label>
                <select
                  name="profileVisibility"
                  id="profileVisibility"
                  className="privacy-option__select"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
                <p className="privacy-option__description">
                  Who can see your profile page?
                </p>
              </div>

              <div className="privacy-line"></div>

              <div className="privacy-option">
                <label
                  htmlFor="postVisibility"
                  className="privacy-option__label"
                >
                  Post Visibility:
                </label>
                <select
                  name="postVisibility"
                  id="postVisibility"
                  className="privacy-option__select"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
                <p className="privacy-option__description">
                  Who can see your posts?
                </p>
              </div>

              <div className="privacy-line"></div>

              <div className="privacy-option">
                <label
                  htmlFor="contactPreference"
                  className="privacy-option__label"
                >
                  Who can contact me:
                </label>
                <select
                  name="contactPreference"
                  id="contactPreference"
                  className="privacy-option__select"
                >
                  <option value="everyone">Everyone</option>
                  <option value="friends">Friends Only</option>
                  <option value="nobody">Nobody</option>
                </select>
                <p className="privacy-option__description">
                  Who can send you messages or friend requests?
                </p>
              </div>

              <div className="privacy-line"></div>

              <div className="privacy-option">
                <label
                  htmlFor="findPreference"
                  className="privacy-option__label"
                >
                  How people can find you:
                </label>
                <select
                  name="findPreference"
                  id="findPreference"
                  className="privacy-option__select"
                >
                  <option value="search">Allow search</option>
                  <option value="friendRequests">
                    Only through friend requests
                  </option>
                  <option value="nobody">Nobody can find me</option>
                </select>
                <p className="privacy-option__description">
                  How can people discover your profile?
                </p>
              </div>

              <div className="privacy-line"></div>

              <button type="submit" className="privacy-options__save-button">
                Save Changes
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
