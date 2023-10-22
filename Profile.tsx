import { useEffect, useState, useRef, ChangeEvent, SetStateAction } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  getAllUsers,
  getProfilePic,
  getFriendsList,
  checkFriends,
  addFriend,
  removeFriend,
  getFilteredUsersPFP 
} from "../Back End/validation";
import User from "../Components/user";
import "../Components/Profile.css";
import "../Components/NavBar.css";

function Profile() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [profilePicUrls, setProfilePicUrls] = useState<string[]>([]);
  const [friendsPFPUrls, setFriendsPFPUrls] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addButtonDisplay, setAddButtonDisplay] = useState(false);
  const [removeButtonDisplay, setRemoveButtonDisplay] = useState(false);

  const searchContainerRef = useRef(null);
  const location = useLocation();
  const currentUser = location.state?.user;
  const targetUser = location.state?.target;
  const targetEmail = targetUser.email;
  let friends: User[];
  let pfpName = "Null";
  
  if(targetUser.profilePic !== pfpName) {
    pfpName = targetUser.profilePic;
  }
  
  useEffect(() => {
    async function loadProfilePic() {
      const url = await getProfilePic(targetEmail, pfpName);
      if (url) {
        setProfilePicUrl(url);
      }
    }

    loadProfilePic();
  }, [targetEmail, pfpName]);

  useEffect(() => {
    async function loadFriends() {
      friends = await getFriendsList(currentUser.email);

      if(friends.length > 0) {
        loadFriendsPFP();
      }
    }

    loadFriends();
  }, []);

  async function loadFriendsPFP() {
    const friendsPFPs = await getFilteredUsersPFP(friends);
    // console.log(friendsPFPs);
  
    setFriendsPFPUrls(friendsPFPs);
  }

  useEffect(() => {
    // Add a click event listener to the document
    const handleClickOutside = (event: { target: any; }) => {
      if (searchContainerRef.current && !(searchContainerRef.current as HTMLElement).contains(event.target)) {
        // Clicked outside of the search container, close the dropdown
        setDropdownOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    if (currentUser) {
      currentUser.loginStatus = false;
    }
  }

  const handleEventsLink = () =>{ 
    navigate("/create-events", { state: { user: currentUser } });
  }

  const handleAddButton = async () => {
    const check = await checkFriends(currentUser.email, targetEmail);
    if (currentUser.email !== targetUser.email && !check) {
      await addFriend(currentUser, targetUser);
    }
  }

  useEffect(() => {
    async function updateAddButtonDisplay() {
      const check = await checkFriends(currentUser.email, targetEmail);
      setAddButtonDisplay(currentUser.email !== targetUser.email && !check);
    }

    updateAddButtonDisplay();
  }, [currentUser.email, targetEmail]);

  const handleRemoveButton = async () => {
    const check = await checkFriends(currentUser.email, targetEmail);
    if (currentUser.email !== targetUser.email && check) {
      await removeFriend(currentUser, targetUser);
    }
  }

  useEffect(() => {
    async function updateRemoveButtonDisplay() {
      const check = await checkFriends(currentUser.email, targetEmail);
      setRemoveButtonDisplay(currentUser.email !== targetUser.email && check);
    }

    updateRemoveButtonDisplay();
  }, [currentUser.email, targetEmail]);

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    const holder = await getAllUsers();
    setSearchTerm(searchTerm);
  
    // Check if searchTerm is empty or contains only white-space characters
    if (!searchTerm.trim()) {
      setFilteredUsers([]);
      return;
    }

    // Filter users based on search term
    const filtered = holder.filter(
      (user: { first_name: string; surname: string; username: string; }) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let pfpURLS: SetStateAction<string[]> = [];

    if(filtered.length > 0) {
      pfpURLS = await getFilteredUsersPFP(filtered);
    }
  
    setProfilePicUrls(pfpURLS);
    setFilteredUsers(filtered);
    setDropdownOpen(true);
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
              <div className="targetUser-details">
                <p className="targetUser-name">{targetUser.first_name}</p>
                <p className="targetUser-username">@{targetUser.username}</p>

                <button
                  className="add-button"
                  onClick={handleAddButton}
                  style={{display: addButtonDisplay ? 'block' : 'none'}}
                >
                  Add Friend
                </button>
                <button
                  className="remove-button"
                  onClick={handleRemoveButton}
                  style={{display: removeButtonDisplay ? 'block' : 'none'}}
                >
                  Remove Friend
                </button>
              </div>
          </div>
        )}
        <h1>Profile</h1>

        {/* <div className="friends-container">
          <h2>Friends</h2>
          <div className="friends-section">
            <div className="friends-list">
              {friends.map((friend, index) => (
                <div key={index} className="friend-entry">
                  <img src={friendsPFPUrls[index]} alt="Profile" className="friend-pic" />
                  <p className="friend-username">@{friend.username}</p>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Search Bar and Search Results Container */}
        <div ref={searchContainerRef} className="search-container">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {/* Search Results Dropdown */}
          {dropdownOpen && (
            <div className="search-results">
              <ul>
                {filteredUsers.map((targetUser, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSearchTerm("");
                      setDropdownOpen(false);
                      navigate("/profile", { 
                        state: { user: currentUser, target: targetUser }
                      });
                    }}
                  >
                    <div className="search-result-entry">
                      <img src={profilePicUrls[index]} alt="Profile" className="search-result-pic" />
                      <div className="search-result-details">
                        <p>{targetUser.username}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
