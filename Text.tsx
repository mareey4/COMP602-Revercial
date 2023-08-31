import React from "react";
import "./Text.css";
import { saveUserData } from "./firebase";
import "./user";

const Text = () => {
  const handleCreateClick = () => {
    const firstName = document.querySelector('input[name="fname"]');
    const lastName = document.querySelector('input[name="lname"]');
    const dob = document.querySelector('input[name="dob"]');
    const email = document.querySelector('input[name="email"]');
    const username = document.querySelector('input[name="username"]');
    const password = document.querySelector('input[name="password"]');

    if (!firstName || !lastName || !dob || !email || !username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const fullName = `${lastName} ${firstName}`;

    const newUser = new User(
      firstName,
      lastName,
      username,
      dob,
      email,
      password
    );

    saveUserData(email, firstName, lastName);
  };

  return (
    <div className="text-container">
      <div className="wrapper">
        <h1>Create Account</h1>
      </div>
      <div className="wrapper-2">
        <label>
          First Name: <input name="fname" /> Last Name: <input name="lname" />
        </label>
        <div>
          <label>
            DOB: <input type="date" name="dob" />
          </label>
        </div>
        <div>
          <label>
            Email: <input name="email" />
          </label>
        </div>
        <div>
          <label>
            Username: <input name="username" />
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
        <div className="create-button-container">
          <button className="create-button" onClick={handleCreateClick}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Text;
