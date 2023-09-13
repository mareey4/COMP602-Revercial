import "./Text.css";
import { getUserViaEmail, saveUserData, validateDOB, login } from "./validation";
import User from "./user";
/* import { useHistory } from "react-router-dom";
 */
function Text() {
  /*   const history = useHistory();
   */ const handleCreateClick = () => {
    console.log("Create button clicked");

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

    // For Benny for login function example
    // let valid = login(email.value, password.value);

    // if(valid) {
    //   alert("Successfully logged in.");
    // } else {
    //   alert("Invalid email/username or password, please try again.");
    // }

    if (!firstName.value || !lastName.value || !dob.value || 
      !email.value || !username.value || !password.value) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/;

    if(emailRegex.test(email.value)) {
      let user = getUserViaEmail(email.value);

      if(user === undefined) {
        const newUser = new User(
          firstName.value,
          lastName.value,
          username.value,
          dob.value,
          email.value,
          password.value
      );

      saveUserData(newUser);
      /*   history.push("srcComponentsProfile.tsx");
       */
      } else {
        alert("Existing account with the given email already exists.");
        return;
      }
    } else {
      alert("Invalid email address, please try again.");
      return;
    }
  };

  return (
    <body>
      <div>
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
    </body>
  );
}

export default Text;
