import React from "react";
/* import db from "./firebase.js";
 */ import "./Text.css";

const Text = () => {
  /*   const createUser = () => {
    const firstName = "Karl";
    const surname = "Francisco";
    const name = `${surname}_${firstName}`;
    const data = {
      Name: firstName,
      Surname: surname,
      "Date of Birth": "26/04/1995",
      Age: 28,
    };

    // Push data to Firebase
    db.ref("Users").child(name).set(data);
  }; */

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
          DOB: <input type="date" name="dob" /> {/* Use type="date" */}
        </div>
        <div>
          Email: <input name="email" />
        </div>
        <div>
          Username: <input name="username" />
        </div>
        <div>
          Password: <input type="password" name="password" />
          <p className="password-requirements">
            Password must have an uppercase letter, a lowercase letter, a
            number, and be at least 8 characters long.
          </p>
        </div>
        <div className="create-button-container">
          <button className="create-button" /* onClick={createUser} */>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Text;
