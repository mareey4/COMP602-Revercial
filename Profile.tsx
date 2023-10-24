import {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  SetStateAction,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getFriendsList,
  checkFriends,
  addFriend,
  removeFriend,
  getFilteredUsersPFP,
  saveUserBio,
  getProfilePic,
  setProfilePic,
  savePostAttachment,
  savePostMetadata,
  getUserViaEmail,
  deletePost,
  getPostsForUser,
  sendDM,
  getDM,
} from "./validation";
import "../Front End/Profile.css";
import "../Front End/NavBar.css";
import { useLocation } from "react-router-dom";
import User from "../Back End/user";

type Post = {
  mediaUrl: string;
  caption: string;
  postId: string;
  fileName: string;
  isEditing?: boolean;
};

function Profile() {
  // State to control the sidebar's open/close status.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [addButtonDisplay, setAddButtonDisplay] = useState(false);
  const [removeButtonDisplay, setRemoveButtonDisplay] = useState(false);

  // State to store the profile picture URL.
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [selectedProfilePic, setSelectedProfilePic] = useState<File | null>(
    null
  );
  const [selectedProfilePicName, setSelectedProfilePicName] = useState<
    string | null
  >(null);
  const profilePicInputRef = useRef<HTMLInputElement | null>(null);

  const [showPostEditor, setShowPostEditor] = useState(false); // to toggle the post editor modal
  const [caption, setCaption] = useState(""); // to store the caption
  const [posts, setPosts] = useState<Post[]>([]);
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);

  // States for friends list
  const [profilePicUrls, setProfilePicUrls] = useState<string[]>([]);
  const [friendsList, setFriendsList] = useState<User[]>([]);
  const [friendsPFPUrls, setFriendsPFPUrls] = useState<string[]>([]);

  // States for messaging
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [recievedMessages, setRecieved] = useState<string[]>([]);
  const [openChat, setOpenChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [recipientUser, setRecipient] = useState<User>();

  const [selectedMediaFile, setSelectedMediaFile] = useState<File | null>(null);
  const [isLiked, setIsLiked] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedCaption, setEditedCaption] = useState("");

  // Get the user data from the location state.
  const location = useLocation();
  const user = location.state?.user;
  const targetUser = location.state?.target;
  const targetEmail = targetUser.email;

  // Sanitize email and profile picture name for fetching the profile picture.
  const unsanitizedEmail = user.email;
  const unsanitizedPFPName = user.profilePic;

  // Add a state variable for the user's bio
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user.bio || ""); // Initialize with the user's existing bio, if available

  const maxCharacterLimit = 500;

  const chatBoxRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Variables for target user information
  let friends: User[];
  let friendsPFPs: string[];
  let sentDMs: string[];
  let recievedDMs: string[];
  let userPosts: Post[];
  let pfpName = "Null";

  if (targetUser.profilePic !== pfpName) {
    pfpName = targetUser.profilePic;
  }

  // useEffect to load the user's profile picture.
  useEffect(() => {
    async function loadProfilePic() {
      const url = await getProfilePic(targetEmail, pfpName);
      await loadFriends();

      if (url) {
        setProfilePicUrl(url);
      }

      if (friends) {
        await loadFriendsPFP();
      }

      if (friends) {
        await setFriendsList(friends);
      }

      if (friendsPFPs) {
        await setFriendsPFPUrls(friendsPFPs);
      }
    }

    loadProfilePic();
  }, [targetEmail, pfpName]);

  // Function to retrieve the profiles for the friends list
  async function loadFriends() {
    friends = await getFriendsList(user.email);
  }

  // Function to retrieve the profile pictures of friends list
  async function loadFriendsPFP() {
    friendsPFPs = await getFilteredUsersPFP(friends);
  }

  useEffect(() => {
    // Add a click event listener to the document
    const handleClickOutside = (event: { target: any }) => {
      if (
        searchContainerRef.current &&
        !(searchContainerRef.current as HTMLElement).contains(event.target)
      ) {
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

  useEffect(() => {
    // Add a click event listener for the chat box
    const handleClickOutside = (event: { target: any }) => {
      if (
        openChat &&
        chatBoxRef.current &&
        !(chatBoxRef.current as HTMLElement).contains(event.target)
      ) {
        // Clicked outside of the chat box, close it
        setOpenChat(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openChat]);

  useEffect(() => {
    async function fetchPosts() {
      const userPosts = await getPostsForUser(targetUser.username);
      setPosts(userPosts);
    }

    fetchPosts();
  }, [targetUser.username]);

  useEffect(() => {
    async function fetchBio() {
      const fetchedUser = await getUserViaEmail(user.email);
      if (fetchedUser) {
        setBio(fetchedUser.bio || "");
      }
    }

    fetchBio();
  }, [user.email]);

  // Function to toggle the sidebar open/close status.
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddButton = async () => {
    const check = await checkFriends(user.email, targetEmail);
    if (user.email !== targetUser.email && !check) {
      await addFriend(user, targetUser);
    }
  };

  useEffect(() => {
    async function updateAddButtonDisplay() {
      const check = await checkFriends(user.email, targetEmail);
      setAddButtonDisplay(user.email !== targetUser.email && !check);
    }

    updateAddButtonDisplay();
  }, [user.email, targetEmail]);

  const handleRemoveButton = async () => {
    const check = await checkFriends(user.email, targetEmail);
    if (user.email !== targetUser.email && check) {
      await removeFriend(user, targetUser);
    }
  };

  useEffect(() => {
    async function updateRemoveButtonDisplay() {
      const check = await checkFriends(user.email, targetEmail);
      setRemoveButtonDisplay(user.email !== targetUser.email && check);
    }

    updateRemoveButtonDisplay();
  }, [user.email, targetEmail]);

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
      (user: { first_name: string; surname: string; username: string }) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let pfpURLS: SetStateAction<string[]> = [];

    if (filtered.length > 0) {
      pfpURLS = await getFilteredUsersPFP(filtered);
    }

    setProfilePicUrls(pfpURLS);
    setFilteredUsers(filtered);
    setDropdownOpen(true);
  };

  // Function to handle user logout (not fully implemented).
  const handleLogout = () => {
    if (user) {
      user.loginStatus = false; // Update the login status (Note: This might need further implementation).
    }
  };

  const handleProfilePicChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Element clicked:", e.currentTarget);

    console.log("Logged-in user:", user.email);
    console.log("Profile being viewed:", targetUser.email);
    if (user.email == targetUser.email) {
      if (profilePicInputRef.current) {
        profilePicInputRef.current.click();
      }
    }
  };

  const handleProfilePicInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (user.email == targetUser.email) {
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
    }
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedMediaFile(file);
      setFileName(file.name);
    }
  };

  const handleJoinEventsLink = (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("Navigating to JoinEvents with user:", user);
    navigate("/join-events", { state: { user: user } });
  };

  const handleSavePost = async () => {
    try {
      const postId = Date.now().toString();

      const mediaUrl = await savePostAttachment(
        user.username,
        postId,
        selectedMediaFile
      );

      await savePostMetadata(user.username, postId, caption, mediaUrl);

      setPosts([...posts, { mediaUrl, caption, postId, fileName }]);

      setShowPostEditor(false);
      alert("Post saved successfully!");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("An error occurred while saving the post.");
    }
  };

  const handleShowOptions = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation(); // Prevents any parent handlers from being executed

    if (showOptionsFor === post.postId) {
      setShowOptionsFor(null); // hide the options if they are already shown
    } else {
      setShowOptionsFor(post.postId); // otherwise, show them
    }
  };

  const handleDeletePost = async (username: string, postId: string) => {
    //loop through array and look for matching postid then when it matches, take the filename of that object
    //that is the filename that you pass in await deletePost(user.username, postId, fileName); // Backend deletion
    console.log("Delete button clicked for post: ${postId}");
    let fileName: string | null = null;

    for (const post of posts) {
      if (post.postId === postId) {
        fileName = post.fileName;
        break;
      }
    }
    if (!fileName) {
      console.error("File name not found for post:", postId);
      return;
    }

    if (user.email !== targetUser.email) {
      try {
        await deletePost(user.username, postId, fileName); // Backend deletion
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.postId !== postId)
        );

        alert("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("An error occurred while deleting the post.");
      }
    }
  };

  const handleEditClick = (postId: string, currentCaption: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.postId === postId) {
        return {
          ...post,
          isEditing: !post.isEditing,
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    if (!posts.find((post) => post.postId === postId)?.isEditing) {
      setEditedCaption(currentCaption);
    }
  };

  const handleSaveEditedCaption = (postId: string) => {
    const updatedPosts = posts.map((post) =>
      post.postId === postId
        ? { ...post, caption: editedCaption, isEditing: false }
        : post
    );
    setPosts(updatedPosts);
    setEditedCaption("");
  };

  const handleBioEditToggle = () => {
    setIsEditingBio((prevState) => !prevState); // Toggle the isEditingBio state
  };

  // Function to handle chat box display
  const handleChatClick = async (friend: User) => {
    setOpenChat(true);
    setRecipient(friend);
    await fetchSentMessages(friend);
    await fetchRecievedMessages(friend);

    if (sentDMs) {
      await setSentMessages(sentDMs);
    }

    if (recievedDMs) {
      await setRecieved(recievedDMs);
    }
  };

  // Function to retrieve sent messages to the target user
  async function fetchSentMessages(friend: User) {
    sentDMs = await getDM(user, friend);
  }

  // Function to retrieve messages from target user
  async function fetchRecievedMessages(friend: User) {
    recievedDMs = await getDM(friend, user);
  }

  // Function for handling the send button
  const handleMessage = async () => {
    // Handle sending a new message
    if (newMessage.trim() === "") {
      return;
    }

    // Save the new message to the target user's inbox in the database
    await sendDM(recipientUser, user, newMessage);

    // Clear the input field and close chat box
    setNewMessage("");
    setOpenChat(false);
  };

  // Function to handle chat message rendering
  function renderChatMessages() {
    const messages = [];

    if (friendsList) {
      for (
        let i = 0;
        i < Math.max(sentMessages.length, recievedMessages.length);
        i++
      ) {
        if (sentMessages[i]) {
          messages.push(
            <div key={`sent-${i}`} className="sent-message">
              <p>{sentMessages[i]}</p>
            </div>
          );
        }

        if (recievedMessages[i]) {
          messages.push(
            <div key={`received-${i}`} className="received-message">
              <p>{recievedMessages[i]}</p>
            </div>
          );
        }
      }
    }
    return messages;
  }

  return (
    <div className="temp">
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
                      state: { user: user, target: targetUser },
                    });
                  }}
                >
                  <div className="search-result-entry">
                    <img
                      src={profilePicUrls[index]}
                      alt="Profile"
                      className="search-result-pic"
                    />
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

        {profilePicUrl && (
          <div className="profile-picture-right">
            <label
              htmlFor="profile-pic"
              onClick={
                user.email === targetUser.email
                  ? handleProfilePicChange
                  : undefined
              }
            >
              <img
                src={profilePicUrl || "default-profile-picture-url"}
                alt="Profile"
                className="profile-pic"
              />
              {user.email === targetUser.email && (
                <div onClick={handleProfilePicChange}>Change Picture</div>
              )}
              <input
                ref={profilePicInputRef}
                type="file"
                id="profile-pic"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePicInputChange}
              />
            </label>

            <div className="user-details">
              <p className="user-name">{targetUser.first_name}</p>
              <p className="user-username">@{targetUser.username}</p>
              <button
                className="add-button"
                onClick={handleAddButton}
                style={{ display: addButtonDisplay ? "block" : "none" }}
              >
                Add Friend
              </button>
              <button
                className="remove-button"
                onClick={handleRemoveButton}
                style={{ display: removeButtonDisplay ? "block" : "none" }}
              >
                Remove Friend
              </button>
            </div>
            {!isEditingBio && targetUser.bio && (
              <div className="bio-display">
                <p>{targetUser.bio}</p>
              </div>
            )}
            <div className="pencil-icon" onClick={handleBioEditToggle}>
              &#128393;
            </div>

            {isEditingBio && (
              <div className="bio-section">
                <h2>Bio</h2>
                <textarea
                  className="bio-textarea"
                  value={bio}
                  onChange={handleBioChange}
                  placeholder="Type your bio here"
                  maxLength={maxCharacterLimit}
                />
                <div className="char-counter">
                  Character Count: {bio.length}/{maxCharacterLimit}
                </div>
                <button onClick={handleSaveBio}>Save Bio</button>
              </div>
            )}

            <div className="friends-display">
              <ul>
                {friendsList.map((targetUser, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleChatClick(targetUser);
                    }}
                  >
                    <div className="friends-entry">
                      <img
                        src={friendsPFPUrls[index]}
                        alt="Profile"
                        className="friends-pic"
                      />
                      <div className="friends-details">
                        <p>{targetUser.username}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {openChat && (
              <div className="chat-box">
                <div className="chat-messages">
                  <div className="scrollable-messages">
                    {renderChatMessages()}
                  </div>
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button onClick={handleMessage}>Send</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="posts-container">
          {posts.map((post, index) => (
            <div key={index} className="post">
              <img
                src={post.mediaUrl}
                alt="Post"
                className="posts-container img"
              />

              <div className="post-actions">
                <button
                  className={`love-button ${
                    isLiked.includes(post.postId) ? "liked" : ""
                  }`}
                  onClick={() => {
                    if (isLiked.includes(post.postId)) {
                      setIsLiked((prevLikedPosts) =>
                        prevLikedPosts.filter((id) => id !== post.postId)
                      );
                    } else {
                      setIsLiked((prevLikedPost) => [
                        ...prevLikedPost,
                        post.postId,
                      ]);
                    }
                  }}
                >
                  {isLiked.includes(post.postId) ? "❤️" : "♡"}
                </button>
              </div>

              <div key={post.postId}>
                {post.isEditing ? (
                  <div className="post-caption">
                    <input
                      className="edit-input"
                      type="text"
                      value={editedCaption}
                      onChange={(e) => setEditedCaption(e.target.value)}
                    />
                    <button
                      className="edit-save-button"
                      onClick={() => handleSaveEditedCaption(post.postId)}
                    >
                      Save
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(post.postId, post.caption)}
                    >
                      🖉
                    </button>
                  </div>
                ) : (
                  <div className="post-caption">
                    <p className="post-caption-text">
                      @{targetUser.username}: {post.caption}
                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEditClick(post.postId, post.caption)
                        }
                      >
                        🖉
                      </button>
                    </p>
                  </div>
                )}
              </div>
              <div className="post-options">
                <div
                  className="options-button"
                  onClick={(e) => handleShowOptions(e, post)}
                >
                  •••
                </div>
                {showOptionsFor === post.postId && (
                  <div className="post-dropdown">
                    <button
                      onClick={() =>
                        handleDeletePost(user.username, post.postId)
                      }
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Main Content */}
        <div className="main-content">
          <div className="add-post-btn" onClick={() => setShowPostEditor(true)}>
            +
          </div>
          {/* Post Editor Modal */}
          {showPostEditor && (
            <div className="post-editor-modal">
              <button
                className="exit-button"
                onClick={() => setShowPostEditor(false)}
              >
                X
              </button>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaFileChange}
              />
              <textarea
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <button onClick={handleSavePost}>Post</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
