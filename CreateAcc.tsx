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
} from "./validation"; // Importing validation functions and other dependencies

import React, { useState } from "react"; // Importing React and the useState hook
import User from "./user"; // Importing a User class
import { useNavigate, Link } from "react-router-dom"; // Importing navigation components from React Router
import Logo from "../Front End/Logo.svg"; // Importing an image (logo)

function Text() {
  // State variables to manage form input values
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // React Router's navigate function for routing
  const navigate = useNavigate();

  // Function to handle the "Create" button click
  const handleCreateClick = async () => {
    // Initialize an error message
    let errorMsg = "Error:\n";

    // Check if any required fields are empty
    if (!firstName || !lastName || !dob || !email || !username || !password) {
      errorMsg += "  - Please fill in all fields.\n";
    }

    // Validate user inputs using validation functions
    const isFirstNameValid = await validateName(firstName);
    const isLastNameValid = await validateName(lastName);
    const isDOBValid = await validateDOB(dob);
    const isUsernameValid = await validateUsername(username);
    const isPasswordValid = await validatePassword(password);
    const isEmailValid = await validateEmail(email);

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
      let resultEmail = await getUserViaEmail(email);
      let resultUsername = await getUserViaUsername(username);

      // Placeholder for default profile picture
      let defaultPFP = "Null";

      if (resultEmail === undefined) {
        if (resultUsername === undefined) {
          // Create a new User object
          const newUser = new User(
            firstName,
            lastName,
            username,
            dob,
            email,
            password,
            false,
            defaultPFP,
            ""
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

        {/* Input fields for user information */}
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
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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

        {/* Password requirements */}
        <p className="password-requirements">
          Password must have an uppercase letter, a lowercase letter, a number,
          and be at least 8 characters long.
        </p>

        {/* Link to the login page */}
        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>

        {/* Create button */}
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
