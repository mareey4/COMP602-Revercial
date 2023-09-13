import "./Text.css";
import {
  getUserViaEmail,
  saveUserData,
  validateName,
  validateDOB,
} from "./validation";
import React, { useState } from "react";
import User from "./user";
import { Link } from "react-router-dom";
/* import { useHistory } from "react-router-dom"; // Import useHistory
 */
function Text() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  /* const history = useHistory(); // Create history object

  const handleFirstNameChange = (e) => {
    const firstNameValue = e.target.value;
    setFirstName(firstNameValue);
    setIsButtonDisabled(!validateForm(firstNameValue, lastName));
  };

  const handleLastNameChange = (e) => {
    const lastNameValue = e.target.value;
    setLastName(lastNameValue);
    setIsButtonDisabled(!validateForm(firstName, lastNameValue));
  }; */

  /*   const validateForm = (firstNameValue, lastNameValue) => {
    return (
      firstNameValue.trim() !== "" &&
      lastNameValue.trim() !== "" &&
      validateName(firstNameValue) &&
      validateName(lastNameValue)
    );
  }; */

  const handleCreateClick = async () => {
    if (!isButtonDisabled) {
      console.log("Create button clicked");

      const firstNameInput = document.querySelector(
        'input[name="fname"]'
      ) as HTMLInputElement;
      const lastNameInput = document.querySelector(
        'input[name="lname"]'
      ) as HTMLInputElement;
      const dobInput = document.querySelector(
        'input[name="dob"]'
      ) as HTMLInputElement;
      const emailInput = document.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement;
      const usernameInput = document.querySelector(
        'input[name="username"]'
      ) as HTMLInputElement;
      const passwordInput = document.querySelector(
        'input[name="password"]'
      ) as HTMLInputElement;

      if (
        !firstNameInput.value ||
        !lastNameInput.value ||
        !dobInput.value ||
        !emailInput.value ||
        !usernameInput.value ||
        !passwordInput.value
      ) {
        alert("Please fill in all fields.");
        return;
      }

      const isFirstNameValid = await validateName(firstNameInput.value);
      const isLastNameValid = await validateName(lastNameInput.value);

      if (!isFirstNameValid || !isLastNameValid) {
        alert("Invalid name");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/;

      if (emailRegex.test(emailInput.value)) {
        let user = getUserViaEmail(emailInput.value);

        if (user === undefined) {
          const newUser = new User(
            firstNameInput.value,
            lastNameInput.value,
            usernameInput.value,
            dobInput.value,
            emailInput.value,
            passwordInput.value
          );

          saveUserData(newUser);
          /*  history.push("/profile"); // Redirect to the profile page */
        } else {
          alert("Existing account with the given email already exists.");
        }
      } else {
        alert("Invalid email address, please try again.");
      }
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
        <div>
          <label>
            DOB: <input type="date" name="dob" />
          </label>
        </div>
        <div>
          <label>
            Email: <input type="text" name="email" />
          </label>
        </div>
        <div>
          <label>
            Username: <input type="text" name="username" />
          </label>
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" />
          </label>
          <p className="password-requirements">
            Password must have an uppercase letter, a lowercase letter, a
            number, and be at least 8 characters long.
          </p>
        </div>
        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
      <div className="create-button-container">
        <a href="src\Components\Profile.tsx">
          <button
            className="create-button"
            onClick={handleCreateClick}
            disabled={isButtonDisabled} // Add this line
          >
            Create
          </button>
        </a>
      </div>
      {}
      {/*         {nameError && <p>{nameError}</p>}
       */}{" "}
    </div>
  );
}

export default Text;
