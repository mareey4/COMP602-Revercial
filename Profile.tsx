import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  saveUserBio,
  getProfilePic,
  setProfilePic,
  savePostAttachment,
  savePostMetadata,
  getUserViaEmail,
  deletePostFromDatabase,
  getPostsForUser,
} from "./validation";
import "../Front End/Profile.css";
import "../Front End/NavBar.css";
import { useLocation } from "react-router-dom";

type Post = {
  mediaUrl: string;
  caption: string;
  postId: string;
};

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

  const [showPostEditor, setShowPostEditor] = useState(false); // to toggle the post editor modal
  const [caption, setCaption] = useState(""); // to store the caption
  const [posts, setPosts] = useState<Post[]>([]);
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);

  const [selectedMediaFile, setSelectedMediaFile] = useState<File | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedCaption, setEditedCaption] = useState("");

  // Get the user data from the location state.
  const location = useLocation();
  const user = location.state?.user;

  // Sanitize email and profile picture name for fetching the profile picture.
  const unsanitizedEmail = user.email;
  const unsanitizedPFPName = user.profilePic;

  // Add a state variable for the user's bio
  const [bio, setBio] = useState(user.bio || ""); // Initialize with the user's existing bio, if available
  const [isEditingBio, setIsEditingBio] = useState(false);

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

  useEffect(() => {
    async function fetchPosts() {
      const userPosts = await getPostsForUser(user.username);
      setPosts(userPosts);
    }

    fetchPosts();
  }, [user.username]);

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

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedMediaFile(file);
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

      setPosts([...posts, { mediaUrl, caption, postId }]);

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

  const handleDeletePost = async (postId: string, username: string) => {
    try {
      await deletePostFromDatabase(postId, username); // Backend deletion
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.postId !== postId)
      ); // Local state update

      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  const handleEditClick = (postId: string, currentCaption: string) => {
    if (editingPostId === postId) {
      setEditingPostId(null); // Hide the editor if it's already shown for this post
      setEditedCaption(""); // Clear the edited caption
    } else {
      setEditingPostId(postId); // Show the editor for this post
      setEditedCaption(currentCaption); // Set the current caption to the edited caption state
    }
  };

  const handleSaveEditedCaption = (postId: string) => {
    const updatedPosts = posts.map((post) =>
      post.postId === postId ? { ...post, caption: editedCaption } : post
    );
    setPosts(updatedPosts);
    setEditingPostId(null);
    setEditedCaption("");
  };

  const handleBioEditToggle = () => {
    setIsEditingBio((prevState) => !prevState); // Toggle the isEditingBio state
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

      {profilePicUrl && (
        <div className="profile-picture-right">
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

          {!isEditingBio && (
            <div className="bio-display">
              <p>{bio}</p>
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
                className={`love-button ${isLiked ? "liked" : ""}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? "❤️" : "♡"}
              </button>
            </div>

            {editingPostId === post.postId ? (
              <>
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                />
                <button onClick={() => handleSaveEditedCaption(post.postId)}>
                  Save
                </button>
              </>
            ) : null}
            <div className="post-caption">
              <p className="post-caption">
                @{user.username}: {post.caption}
              </p>
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
                    onClick={() => handleDeletePost(post.postId, user.username)}
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
  );
}

export default Profile;
