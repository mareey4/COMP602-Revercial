import "./Text.css";
import { saveUserData } from "./firebase";
import User from "./user";

function Text() {
  const handleCreateClick = () => {
    console.log("Create button clicked");

    const firstNameInput = document.querySelector('input[name="fname"]') as HTMLInputElement;
    const lastNameInput = document.querySelector('input[name="lname"]') as HTMLInputElement;
    const dobInput = document.querySelector('input[name="dob"]') as HTMLInputElement;
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;

    if (!firstNameInput || !lastNameInput || !dobInput || !emailInput || !usernameInput || !passwordInput) {
      alert("Please fill in all fields.");
      return;
    }

    const fullName = `${lastNameInput} ${firstNameInput}`; // Not sure if this is needed anywhere - Karl
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const username = usernameInput.value;
    const dob = dobInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const newUser = new User(
      firstName,
      lastName,
      username,
      dob,
      email,
      password
    );

    console.log(newUser);

    saveUserData(newUser);
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
}

export default Text;
