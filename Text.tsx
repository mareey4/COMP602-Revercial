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
import { useNavigate, Link } from "react-router-dom";

function Text() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleCreateClick = async () => {
    const firstName = document.querySelector(
      'input[name="fname"]'
    ) as HTMLInputElement;
    const lastName = document.querySelector(
      'input[name="lname"]'
    ) as HTMLInputElement;
    const dob = document.querySelector(
      'input[name="dob"]'
    ) as HTMLInputElement;
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
      errorMsg += "  - Invalid username, must be 4 characters long and must not include special \n    characters.\n";
    }

    if (!isPasswordValid) {
      errorMsg += "  - Invalid password.\n";
    }

    if (!isEmailValid) {
      errorMsg += "  - Invalid email address.";
    }

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

      if (resultEmail === undefined) {
        if(resultUsername === undefined) {
          const newUser = new User(
            firstName.value,
            lastName.value,
            username.value,
            dob.value,
            email.value,
            password.value,
            false,
            undefined
          );
  
          alert("Successfully Created");
          saveUserData(newUser); // To save to database
          navigate("/profile"); // Redirect to Profile Page
        } else {
          alert("Existing account with the given username already exists.");
        }
      } else {
        alert("Existing account with the given email already exists.");
        return;
      }
    } else {
      alert(errorMsg);
      return;
    }
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
            <Link to="/Login">Already have an account?</Link>{" "}
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
