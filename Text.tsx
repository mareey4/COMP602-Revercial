import "./Text.css";
import {
  getUserViaEmail,
  saveUserData,
  validateName,
  validateDOB,
  login,
  validateUsername,
  validatePassword,
} from "./validation";
import React, { useState } from "react";
import User from "./user";
import { useNavigate } from "react-router-dom";

function Text() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [dobError, setDOBError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleCreateClick = async () => {
    console.log("Create button clicked");

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

    if (
      !firstName.value ||
      !lastName.value ||
      !dob.value ||
      !email.value ||
      !username.value ||
      !password.value
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const isFirstNameValid = await validateName(firstName.value);
    const isLastNameValid = await validateName(lastName.value);
    const isDOBValid = await validateDOB(dob.value);
    const isUsernameValid = await validateUsername(username.value);
    const isPasswordValid = await validatePassword(password.value);
    console.log("Username:" + isUsernameValid);
    console.log("Password:" + isPasswordValid);

    if (!isFirstNameValid || !isLastNameValid) {
      alert("Invalid name");
      return;
    }

    if (!isDOBValid) {
      alert("Invalid date of birth");
      return;
    }

    if (!isUsernameValid) {
      alert(
        "Invalid username, must be 4 characters long and must not include special characters"
      );
      return;
    }

    if (!isPasswordValid) {
      alert("Invalid password");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/;

    if (emailRegex.test(email.value)) {
      let user = await getUserViaEmail(email.value);

      if (user === undefined) {
        const newUser = new User(
          firstName.value,
          lastName.value,
          username.value,
          dob.value,
          email.value,
          password.value
        );

        alert("Successfully Created");
        navigate("/Profile");
      } else {
        alert("Existing account with the given email already exists.");
        return;
      }
    } else {
      alert("Invalid email address, please try again.");
      return;
    }
    setNameError("");
    setDOBError("");
    setUsernameError("");
    setPasswordError("");
  };

  return (
    <div>
      <div className="wrapper">
        <h1>Create Account</h1>
      </div>
      <div className="wrapper-2">
        <label>
          First Name:{" "}
          <input
            type="text"
            name="fname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />{" "}
          Last Name:{" "}
          <input
            type="text"
            name="lname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        {nameError && <p>{nameError}</p>}
        <div>
          <label>
            DOB:{" "}
            <input
              type="date"
              name="dob"
              value={dob}
              onChange={(e) => setDOB(e.target.value)}
            />
          </label>
          {dobError && <p>{dobError}</p>}
        </div>
        <div>
          <label>
            Email: <input name="email" />
          </label>
        </div>
        <div>
          <label>
            Username:{" "}
            <input
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          {usernameError && <p>{usernameError}</p>}
        </div>
        <div>
          <label>
            Password:{" "}
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {passwordError && <p>{passwordError}</p>}
          <p className="password-requirements">
            Password must have an uppercase letter, a lowercase letter, a
            number, and be at least 8 characters long.
          </p>
        </div>
        <div className="login-link">
          <p>
            Already have an account?{" "}
            <a href="src\Components\login.html">Login here</a>
          </p>
        </div>
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
