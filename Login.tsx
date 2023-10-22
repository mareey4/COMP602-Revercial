import "../Components/Login.css";
import { login } from "../Back End/validation.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    const id = document.querySelector('input[name="username"]') as HTMLInputElement;
    const password = document.querySelector('input[name="password"]') as HTMLInputElement;

    try {
      let resultUser = await login(id.value, password.value);

      if (resultUser !== undefined) {
        if (resultUser.loginStatus) {
          alert("Login Successful");
          navigate("/profile", { state: { user: resultUser, target: resultUser } });
        } else {
          alert("Wrong password!");
        }
      } else {
        alert("Account does not exist!");
      }
    } catch (error) {
      // Handle error here
      console.error(error);
    }
  };

  return (
    <div className="wrapper">
      <form>
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" name="username" placeholder="Username" required />
        </div>
        <div className="input-box">
          <input type="password" name="password" placeholder="Password" required />
        </div>
        <button type="button" id="loginButton" className="btn" onClick={handleLoginClick}>
          Login
        </button>
        <div className="forgot-links">
          <a href="#">Forgot Username or Forgot Password</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
