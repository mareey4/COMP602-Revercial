// import {
//   useEffect,
//   useState,
//   useRef,
//   ChangeEvent,
//   SetStateAction,
// } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   getAllUsers,
//   getFriendsList,
//   checkFriends,
//   addFriend,
//   removeFriend,
//   getFilteredUsersPFP,
//   saveUserBio,
//   getProfilePic,
//   setProfilePic,
//   savePostAttachment,
//   savePostMetadata,
//   getUserViaEmail,
//   deletePostMediaFromStorage,
//   deletePost,
//   getPostsForUser,
// } from "./validation";
// import "../Front End/Profile.css";
// import "../Front End/NavBar.css";
// import { useLocation } from "react-router-dom";
// import User from "../Back End/user";

// type Post = {
//   mediaUrl: string;
//   caption: string;
//   postId: string;
//   fileName: string;
// };

// function Profile() {
//   // State to control the sidebar's open/close status.
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [profilePicUrls, setProfilePicUrls] = useState<string[]>([]);
//   const [friendsPFPUrls, setFriendsPFPUrls] = useState<string[]>([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [addButtonDisplay, setAddButtonDisplay] = useState(false);
//   const [removeButtonDisplay, setRemoveButtonDisplay] = useState(false);

//   // State to store the profile picture URL.
//   const [profilePicUrl, setProfilePicUrl] = useState(null);
//   const [selectedProfilePic, setSelectedProfilePic] = useState<File | null>(
//     null
//   );
//   const [selectedProfilePicName, setSelectedProfilePicName] = useState<
//     string | null
//   >(null);
//   const profilePicInputRef = useRef<HTMLInputElement | null>(null);

//   const [showPostEditor, setShowPostEditor] = useState(false); // to toggle the post editor modal
//   const [caption, setCaption] = useState(""); // to store the caption
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);

//   const [selectedMediaFile, setSelectedMediaFile] = useState<File | null>(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [fileName, setFileName] = useState("");
//   const [editingPostId, setEditingPostId] = useState<string | null>(null);
//   const [editedCaption, setEditedCaption] = useState("");

//   // Get the user data from the location state.
//   const location = useLocation();
//   const user = location.state?.user;

//   // Sanitize email and profile picture name for fetching the profile picture.
//   const unsanitizedEmail = user.email;
//   const unsanitizedPFPName = user.profilePic;

//   // Add a state variable for the user's bio
//   const [bio, setBio] = useState(user.bio || ""); // Initialize with the user's existing bio, if available
//   const [isEditingBio, setIsEditingBio] = useState(false);

//   const maxCharacterLimit = 500;

//   const searchContainerRef = useRef(null);
//   const currentUser = location.state?.user;
//   const targetUser = location.state?.target;
//   const targetEmail = targetUser.email;
//   let friends: User[];
//   let pfpName = "Null";

//   if (targetUser.profilePic !== pfpName) {
//     pfpName = targetUser.profilePic;
//   }

//   // useEffect to load the user's profile picture.
//   useEffect(() => {
//     async function loadProfilePic() {
//       const url = await getProfilePic(targetEmail, pfpName);
//       if (url) {
//         setProfilePicUrl(url);
//       }
//     }

//     loadProfilePic();
//   }, [targetEmail, pfpName]);

//   useEffect(() => {
//     async function loadFriends() {
//       friends = await getFriendsList(currentUser.email);

//       if (friends.length > 0) {
//         loadFriendsPFP();
//       }
//     }

//     loadFriends();
//   }, []);

//   async function loadFriendsPFP() {
//     const friendsPFPs = await getFilteredUsersPFP(friends);
//     // console.log(friendsPFPs);

//     setFriendsPFPUrls(friendsPFPs);
//   }

//   useEffect(() => {
//     // Add a click event listener to the document
//     const handleClickOutside = (event: { target: any }) => {
//       if (
//         searchContainerRef.current &&
//         !(searchContainerRef.current as HTMLElement).contains(event.target)
//       ) {
//         // Clicked outside of the search container, close the dropdown
//         setDropdownOpen(false);
//       }
//     };

//     // Attach the event listener
//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       // Remove the event listener when the component unmounts
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     async function fetchPosts() {
//       const userPosts = await getPostsForUser(user.username);
//       setPosts(userPosts);
//     }

//     fetchPosts();
//   }, [user.username]);

//   useEffect(() => {
//     async function fetchBio() {
//       const fetchedUser = await getUserViaEmail(user.email);
//       if (fetchedUser) {
//         setBio(fetchedUser.bio || "");
//       }
//     }

//     fetchBio();
//   }, [user.email]);

//   // Function to toggle the sidebar open/close status.
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const handleAddButton = async () => {
//     const check = await checkFriends(currentUser.email, targetEmail);
//     if (currentUser.email !== targetUser.email && !check) {
//       await addFriend(currentUser, targetUser);
//     }
//   };

//   useEffect(() => {
//     async function updateAddButtonDisplay() {
//       const check = await checkFriends(currentUser.email, targetEmail);
//       setAddButtonDisplay(currentUser.email !== targetUser.email && !check);
//     }

//     updateAddButtonDisplay();
//   }, [currentUser.email, targetEmail]);

//   const handleRemoveButton = async () => {
//     const check = await checkFriends(currentUser.email, targetEmail);
//     if (currentUser.email !== targetUser.email && check) {
//       await removeFriend(currentUser, targetUser);
//     }
//   };

//   useEffect(() => {
//     async function updateRemoveButtonDisplay() {
//       const check = await checkFriends(currentUser.email, targetEmail);
//       setRemoveButtonDisplay(currentUser.email !== targetUser.email && check);
//     }

//     updateRemoveButtonDisplay();
//   }, [currentUser.email, targetEmail]);

//   const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
//     const searchTerm = event.target.value;
//     const holder = await getAllUsers();
//     setSearchTerm(searchTerm);

//     // Check if searchTerm is empty or contains only white-space characters
//     if (!searchTerm.trim()) {
//       setFilteredUsers([]);
//       return;
//     }

//     // Filter users based on search term
//     const filtered = holder.filter(
//       (user: { first_name: string; surname: string; username: string }) =>
//         user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.username.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     let pfpURLS: SetStateAction<string[]> = [];

//     if (filtered.length > 0) {
//       pfpURLS = await getFilteredUsersPFP(filtered);
//     }

//     setProfilePicUrls(pfpURLS);
//     setFilteredUsers(filtered);
//     setDropdownOpen(true);
//   };

//   // Function to handle user logout (not fully implemented).
//   const handleLogout = () => {
//     if (user) {
//       user.loginStatus = false; // Update the login status (Note: This might need further implementation).
//     }
//   };

//   const handleProfilePicChange = () => {
//     if (profilePicInputRef.current) {
//       profilePicInputRef.current.click();
//     }
//   };

//   const handleProfilePicInputChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files && e.target.files[0];

//     if (file) {
//       setSelectedProfilePic(file);
//       setSelectedProfilePicName(file.name);

//       try {
//         // Upload the selected profile picture to Firebase Storage
//         await setProfilePic(user, file);

//         // Set the profilePicUrl to the new URL
//         const newUrl = await getProfilePic(user.email, file.name);
//         setProfilePicUrl(newUrl);

//         // Display a success message
//         alert("Profile picture uploaded successfully!");
//       } catch (error) {
//         console.error("Error uploading profile picture:", error);
//         alert("An error occurred while uploading the profile picture.");
//       }
//     }
//   };

//   const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//     // Update the bio state when the input changes
//     setBio(event.target.value);
//   };

//   const handleSaveBio = () => {
//     // Call the saveUserBio function to save the user's bio
//     saveUserBio(user.email, bio);
//     alert("Bio saved successfully!");
//   };

//   const handleEventsLink = () => {
//     navigate("/profile", { state: { user: user } });
//   };

//   const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files && e.target.files[0];
//     if (file) {
//       setSelectedMediaFile(file);
//       setFileName(file.name);
//     }
//   };

//   const handleJoinEventsLink = (event: React.MouseEvent) => {
//     event.preventDefault();
//     console.log("Navigating to JoinEvents with user:", user);
//     navigate("/join-events", { state: { user: user } });
//   };

//   const handleSavePost = async () => {
//     try {
//       const postId = Date.now().toString();

//       const mediaUrl = await savePostAttachment(
//         user.username,
//         postId,
//         selectedMediaFile
//       );

//       await savePostMetadata(user.username, postId, caption, mediaUrl);

//       setPosts([...posts, { mediaUrl, caption, postId, fileName }]);

//       setShowPostEditor(false);
//       alert("Post saved successfully!");
//     } catch (error) {
//       console.error("Error saving post:", error);
//       alert("An error occurred while saving the post.");
//     }
//   };

//   const handleShowOptions = (e: React.MouseEvent, post: Post) => {
//     e.stopPropagation(); // Prevents any parent handlers from being executed

//     if (showOptionsFor === post.postId) {
//       setShowOptionsFor(null); // hide the options if they are already shown
//     } else {
//       setShowOptionsFor(post.postId); // otherwise, show them
//     }
//   };

//   const handleDeletePost = async (username: string, postId: string) => {
//     //loop through array and look for matching postid then when it matches, take the filename of that object
//     //that is the filename that you pass in await deletePost(user.username, postId, fileName); // Backend deletion
//     try {
//       await deletePost(user.username, postId, fileName); // Backend deletion
//       setPosts((prevPosts) =>
//         prevPosts.filter((post) => post.postId !== postId)
//       ); // Local state update

//       alert("Post deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting post:", error);
//       alert("An error occurred while deleting the post.");
//     }
//   };

//   const handleEditClick = (postId: string, currentCaption: string) => {
//     if (editingPostId === postId) {
//       setEditingPostId(null); // Hide the editor if it's already shown for this post
//       setEditedCaption(""); // Clear the edited caption
//     } else {
//       setEditingPostId(postId); // Show the editor for this post
//       setEditedCaption(currentCaption); // Set the current caption to the edited caption state
//     }
//   };

//   const handleSaveEditedCaption = (postId: string) => {
//     const updatedPosts = posts.map((post) =>
//       post.postId === postId ? { ...post, caption: editedCaption } : post
//     );
//     setPosts(updatedPosts);
//     setEditingPostId(null);
//     setEditedCaption("");
//   };

//   const handleBioEditToggle = () => {
//     setIsEditingBio((prevState) => !prevState); // Toggle the isEditingBio state
//   };

//   return (
//     <div className="main-wrapper">
//       {" "}
//       {/* <-- This is the new wrapping div */}
//       <div ref={searchContainerRef} className="search-container">
//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search for users..."
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//         {/* Search Results Dropdown */}
//         {dropdownOpen && (
//           <div className="search-results">
//             <ul>
//               {filteredUsers.map((targetUser, index) => (
//                 <li
//                   key={index}
//                   onClick={() => {
//                     setSearchTerm("");
//                     setDropdownOpen(false);
//                     navigate("/profile", {
//                       state: { user: currentUser, target: targetUser },
//                     });
//                   }}
//                 >
//                   <div className="search-result-entry">
//                     <img
//                       src={profilePicUrls[index]}
//                       alt="Profile"
//                       className="search-result-pic"
//                     />
//                     <div className="search-result-details">
//                       <p>{targetUser.username}</p>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//       <div className={`profile-container ${sidebarOpen ? "sidebar-open" : ""}`}>
//         {/* Sidebar Toggle Button */}
//         <div className="sidebar-toggle" onClick={toggleSidebar}>
//           <div className={`toggle-lines ${sidebarOpen ? "open" : ""}`}>
//             &#9776;
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="sidebar">
//           <h2></h2>
//           <ul>
//             <li>
//               <Link to="/create-events" onClick={handleEventsLink}>
//                 Create Event
//               </Link>
//             </li>
//             <li>
//               <Link to="/join-events" onClick={handleJoinEventsLink}>
//                 Join Events{" "}
//               </Link>
//             </li>
//             <li>
//               <a href="#">Settings</a>
//             </li>
//             <li>
//               <Link to="/Privacy">Privacy Settings</Link>
//             </li>
//             <li>
//               <Link to="/Support">Support Page</Link>
//             </li>
//             <li>
//               <Link to="/Login" onClick={handleLogout}>
//                 Log out
//               </Link>{" "}
//             </li>
//           </ul>
//         </div>

//         {profilePicUrl && (
//           <div className="profile-picture-right">
//             <label htmlFor="profile-pic" onClick={handleProfilePicChange}>
//               <img
//                 src={profilePicUrl || "default-profile-picture-url"}
//                 alt="Profile"
//                 className="profile-pic"
//               />
//             </label>
//             <input
//               ref={profilePicInputRef}
//               type="file"
//               id="profile-pic"
//               accept="image/*"
//               style={{ display: "none" }}
//               onChange={handleProfilePicInputChange}
//             />
//             <div className="user-details">
//               <p className="user-name">{user.first_name}</p>
//               <p className="user-username">@{user.username}</p>
//               <button
//                 className="add-button"
//                 onClick={handleAddButton}
//                 style={{ display: addButtonDisplay ? "block" : "none" }}
//               >
//                 Add Friend
//               </button>
//               <button
//                 className="remove-button"
//                 onClick={handleRemoveButton}
//                 style={{ display: removeButtonDisplay ? "block" : "none" }}
//               >
//                 Remove Friend
//               </button>
//             </div>

//             {!isEditingBio && (
//               <div className="bio-display">
//                 <p>{bio}</p>
//               </div>
//             )}

//             <div className="pencil-icon" onClick={handleBioEditToggle}>
//               &#128393;
//             </div>

//             {isEditingBio && (
//               <div className="bio-section">
//                 <h2>Bio</h2>
//                 <textarea
//                   className="bio-textarea"
//                   value={bio}
//                   onChange={handleBioChange}
//                   placeholder="Type your bio here"
//                   maxLength={maxCharacterLimit}
//                 />
//                 <div className="char-counter">
//                   Character Count: {bio.length}/{maxCharacterLimit}
//                 </div>
//                 <button onClick={handleSaveBio}>Save Bio</button>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="posts-container">
//           {posts.map((post, index) => (
//             <div key={index} className="post">
//               <img
//                 src={post.mediaUrl}
//                 alt="Post"
//                 className="posts-container img"
//               />

//               <div className="post-actions">
//                 <button
//                   className={`love-button ${isLiked ? "liked" : ""}`}
//                   onClick={() => setIsLiked(!isLiked)}
//                 >
//                   {isLiked ? "❤️" : "♡"}
//                 </button>
//               </div>

//               {editingPostId === post.postId ? (
//                 <>
//                   <textarea
//                     value={editedCaption}
//                     onChange={(e) => setEditedCaption(e.target.value)}
//                   />
//                   <button onClick={() => handleSaveEditedCaption(post.postId)}>
//                     Save
//                   </button>
//                 </>
//               ) : null}
//               <div className="post-caption">
//                 <p className="post-caption">
//                   @{user.username}: {post.caption}
//                 </p>
//               </div>
//               <div className="post-options">
//                 <div
//                   className="options-button"
//                   onClick={(e) => handleShowOptions(e, post)}
//                 >
//                   •••
//                 </div>
//                 {showOptionsFor === post.postId && (
//                   <div className="post-dropdown">
//                     <button
//                       onClick={() =>
//                         handleDeletePost(user.username, post.postId)
//                       }
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Main Content */}
//         <div className="main-content">
//           <div className="add-post-btn" onClick={() => setShowPostEditor(true)}>
//             +
//           </div>
//           {/* Post Editor Modal */}
//           {showPostEditor && (
//             <div className="post-editor-modal">
//               <button
//                 className="exit-button"
//                 onClick={() => setShowPostEditor(false)}
//               >
//                 X
//               </button>
//               <input
//                 type="file"
//                 accept="image/*,video/*"
//                 onChange={handleMediaFileChange}
//               />
//               <textarea
//                 placeholder="Add a caption..."
//                 value={caption}
//                 onChange={(e) => setCaption(e.target.value)}
//               />
//               <button onClick={handleSavePost}>Post</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;
import "../Front End/Text.css";
import {
  getUserViaEmail,
  saveUserData,
  validateName,
  validateDOB,
  validateUsername,
  validatePassword,
  validateEmail,
  getUserViaUsername,
} from "./validation";
import React, { useState } from "react";
import User from "./user";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../Front End/Logo.svg";

function Text() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // React Router's navigate function for routing
  const navigate = useNavigate();

  // Function to handle the "Create" button click
  const handleCreateClick = async () => {
    const firstName = document.querySelector(
      'input[name="fname"]'
    ) as HTMLInputElement;
    const lastName = document.querySelector(
      'input[name="lname"]'
    ) as HTMLInputElement;
    const dob = document.querySelector('input[name="dob"]') as HTMLInputElement;
    const email = document.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    const username = document.querySelector(
      'input[name="username"]'
    ) as HTMLInputElement;
    const password = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;

    let errorMsg = "Error:\n";

    // Check if any required fields are empty
    if (
      !firstName.value ||
      !lastName.value ||
      !dob.value ||
      !email.value ||
      !username.value ||
      !password.value
    ) {
      errorMsg += "  - Please fill in all fields.\n";
    }

    // Validate user inputs using validation functions
    const isFirstNameValid = await validateName(firstName.value);
    const isLastNameValid = await validateName(lastName.value);
    const isDOBValid = await validateDOB(dob.value);
    const isUsernameValid = await validateUsername(username.value);
    const isPasswordValid = await validatePassword(password.value);
    const isEmailValid = await validateEmail(email.value);

    if (!isFirstNameValid || !isLastNameValid) {
      errorMsg += "  - Invalid name(s).\n";
    }

    if (!isDOBValid) {
      errorMsg += "  - Invalid date of birth.\n";
    }

    if (!isUsernameValid) {
      errorMsg +=
        "  - Invalid username, must be 4 characters long and must not include special \n    characters.\n";
    }

    if (!isPasswordValid) {
      errorMsg += "  - Invalid password.\n";
    }

    if (!isEmailValid) {
      errorMsg += "  - Invalid email address.";
    }

    // If all validations pass, proceed with creating the user
    if (
      isFirstNameValid &&
      isLastNameValid &&
      isDOBValid &&
      isUsernameValid &&
      isPasswordValid &&
      isEmailValid
    ) {
      let resultEmail = await getUserViaEmail(email.value);
      let resultUsername = await getUserViaUsername(username.value);

      // Placeholder for default profile picture
      let defaultPFP = "Null";

      if (resultEmail === undefined) {
        if (resultUsername === undefined) {
          // Create a new User object
          const newUser = new User(
            firstName.value,
            lastName.value,
            username.value,
            dob.value,
            email.value,
            password.value,
            false,
            defaultPFP
          );

          // Display success message, save user data, and navigate to the profile page
          alert("Successfully Created");
          saveUserData(newUser);
          navigate("/profile", { state: { user: newUser, target: newUser } });
        } else {
          alert("Existing account with the given username already exists.");
        }
      } else {
        alert("Existing account with the given email already exists.");
        return;
      }
    } else {
      // Display error messages for validation failures
      alert(errorMsg);
      return;
    }
  };

  // JSX component with valid questions to create an account
  return (
    <div>
      <img src={Logo} alt="RR Logo" className="rr-logo" />

      <div className="container">
        <h1>Create an Account</h1>
        <label>
          First Name:{" "}
          <input
            type="text"
            name="fname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          ></input>
        </label>

        <label>
          Last Name:{" "}
          <input
            type="text"
            name="lname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          ></input>
        </label>

        <label>
          DOB:{" "}
          <input
            type="date"
            name="dob"
            value={dob}
            onChange={(e) => setDOB(e.target.value)}
          ></input>{" "}
        </label>
        <label>
          Email:
          <input type="text" name="email" />
        </label>

        <label>
          Username:{" "}
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>{" "}
        </label>

        <label>
          Password:{" "}
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>{" "}
        </label>
        <p className="password-requirements">
          Password must have an uppercase letter, a lowercase letter, a number,
          and be at least 8 characters long.
        </p>
        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
        <div className="create-button-container">
          <button className="create-button" onClick={handleCreateClick}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default Text;

// import "../Front End/Text.css";
// import {
//   saveUserData,
//   validateName,
//   validateDOB,
//   validateUsername,
//   validatePassword,
//   validateEmail,
//   getUserViaEmail,
//   getUserViaUsername
// } from "./validation";
// import React, { useState } from "react";
// import User from "../Components/user";
// import { useNavigate, Link } from "react-router-dom";

// function Text() {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [dob, setDOB] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleCreateClick = async () => {
//     const firstName = document.querySelector(
//       'input[name="fname"]'
//     ) as HTMLInputElement;
//     const lastName = document.querySelector(
//       'input[name="lname"]'
//     ) as HTMLInputElement;
//     const dob = document.querySelector(
//       'input[name="dob"]'
//     ) as HTMLInputElement;
//     const email = document.querySelector(
//       'input[name="email"]'
//     ) as HTMLInputElement;
//     const username = document.querySelector(
//       'input[name="username"]'
//     ) as HTMLInputElement;
//     const password = document.querySelector(
//       'input[name="password"]'
//     ) as HTMLInputElement;

//     let errorMsg = "Error:\n";

//     if (
//       !firstName.value ||
//       !lastName.value ||
//       !dob.value ||
//       !email.value ||
//       !username.value ||
//       !password.value
//     ) {
//       errorMsg += "  - Please fill in all fields.\n";
//     }

//     const isFirstNameValid = await validateName(firstName.value);
//     const isLastNameValid = await validateName(lastName.value);
//     const isDOBValid = await validateDOB(dob.value);
//     const isUsernameValid = await validateUsername(username.value);
//     const isPasswordValid = await validatePassword(password.value);
//     const isEmailValid = await validateEmail(email.value);

//     if (!isFirstNameValid || !isLastNameValid) {
//       errorMsg += "  - Invalid name(s).\n";
//     }

//     if (!isDOBValid) {
//       errorMsg += "  - Invalid date of birth.\n";
//     }

//     if (!isUsernameValid) {
//       errorMsg += "  - Invalid username, must be 4 characters long and must not include special \n    characters.\n";
//     }

//     if (!isPasswordValid) {
//       errorMsg += "  - Invalid password.\n";
//     }

//     if (!isEmailValid) {
//       errorMsg += "  - Invalid email address.";
//     }

//     if (
//         isFirstNameValid &&
//         isLastNameValid &&
//         isDOBValid &&
//         isUsernameValid &&
//         isPasswordValid &&
//         isEmailValid
//       ) {
//       let resultEmail = await getUserViaEmail(email.value);
//       let resultUsername = await getUserViaUsername(username.value);
//       let defaultPFP = "Null";
//       let defaultBio = "";

//       if (resultEmail === undefined) {
//         if(resultUsername === undefined) {
//           const newUser = new User(
//             firstName.value,
//             lastName.value,
//             username.value,
//             dob.value,
//             email.value,
//             password.value,
//             false,
//             defaultPFP,
//             defaultBio
//           );

//           alert("Successfully Created");
//           newUser.loginStatus = true;
//           await saveUserData(newUser); // To save to database
//           navigate("/profile", { state: { user: newUser, target: newUser } }); // Redirect to Profile Page
//         } else {
//           alert("Existing account with the given username already exists.");
//         }
//       } else {
//         alert("Existing account with the given email already exists.");
//         return;
//       }
//     } else {
//       alert(errorMsg);
//       return;
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Create Account</h1>
//       <label>
//         First Name:{" "}
//         <input
//           type="text"
//           name="fname"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//         ></input>
//       </label>

//       <label>
//         Last Name:{" "}
//         <input
//           type="text"
//           name="lname"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//         ></input>
//       </label>

//       <label>
//         DOB:{" "}
//         <input
//           type="date"
//           name="dob"
//           value={dob}
//           onChange={(e) => setDOB(e.target.value)}
//         ></input>{" "}
//       </label>
//       <label>
//         Email:
//         <input type="text" name="email" />
//       </label>

//       <label>
//         Username:{" "}
//         <input
//           type="text"
//           name="username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         ></input>{" "}
//       </label>

//       <label>
//         Password:{" "}
//         <input
//           type="password"
//           name="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         ></input>{" "}
//       </label>
//       <p className="password-requirements">
//         Password must have an uppercase letter, a lowercase letter, a number,
//         and be at least 8 characters long.
//       </p>
//       <div className="login-link">
//         <p>
//           Already have an account? <Link to="/login">Login here</Link>
//         </p>
//       </div>
//       <div className="create-button-container">
//         <button className="create-button" onClick={handleCreateClick}>
//           Create
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Text;
