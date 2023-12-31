import "../Front End/Login.css";
import { login } from "./validation.js";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Front End/Logo.svg";

// Define the Login component.
const Login = () => {
  // Initialize the navigate function for programmatic navigation.
  const navigate = useNavigate();

  // Function to handle the login button click.
  const handleLoginClick = async () => {
    // Get the input values for username and password.
    const id = document.querySelector(
      'input[name="username"]'
    ) as HTMLInputElement;
    const password = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;

    try {
      // Call the login function with provided credentials.
      let resultUser = await login(id.value, password.value);

      if (resultUser !== undefined) {
        if (resultUser.loginStatus) {
          // If login is successful, show an alert and navigate to the profile page.
          alert("Login Successful");
          navigate("/profile", {
            state: { user: resultUser, target: resultUser },
          });
        } else {
          // If the password is wrong, show an alert.
          alert("Wrong password!");
        }
      } else {
        // If the account does not exist, show an alert.
        alert("Account does not exist!");
      }
    } catch (error) {
      // Handle any errors that occur during the login process.
      console.error(error);
    }
  };

  // Render the Login component.
  return (
    <div className="h1">
      <h1>Login</h1>
      <img src={Logo} alt="RR Logo" className="rr-logo" />

      <div className="wrapper">
        <form>
          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="button"
            id="loginButton"
            className="btn"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <li>
            <Link to="/create-account">Don't have an account?</Link>
          </li>
          <div className="forgot-links">
            <a href="#">Forgot Username or Forgot Password</a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export the Login component as the default export.
export default Login;
