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
          navigate("/profile", { state: { user: newUser } });
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
    <div className="container">
      <h1>Create Account</h1>
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
  );
}

export default Text;
