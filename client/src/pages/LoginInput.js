import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { InputDefault } from "../components/InputField";
import { SubmitButton } from "../components/Button";

const Login = ({ onLogin }) => { // Accept onLogin prop
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [flashMessage, setFlashMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  async function submitForm() {
    const userData = {
      username: userName,
      password: userPassword,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(response);
        console.log(jsonResponse);
        console.log(jsonResponse.message);
        
        // Call the onLogin function to update the auth state
        onLogin();

        // Use navigate to redirect to the input page
        navigate("/");
      } else {
        if (response.status === 401) {
          setFlashMessage('Incorrect username or password.');
        } else {
          console.error('Error:', response.statusText);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      {flashMessage && <div className="flash-message">{flashMessage}</div>}
      <div className="login-box">
        <div className="input-grid">
          <InputDefault
            label="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <InputDefault
            label="Password"
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
        </div>
        <div className="submit-button">
          <SubmitButton label="Login" onClick={submitForm} />
        </div>
        <div className="register-link">
          <Link to="/Register">Don't have an account? Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
