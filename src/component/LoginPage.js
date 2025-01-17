import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { validateLogin } from "../services/auth";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const handleLogin = async () => {
    // Example validation - you would replace this with actual API call to validate login
    const userData = await validateLogin(userId, password); 
    if (userData) {
      const token = "fakeAccessToken"; // Replace with the actual token you get from your API
      onLogin(token, userData);
      history.push("/dashboard");
    } else {
      setErrorMessage("Invalid User ID or Password");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <div className="login-form">
        <label>User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
