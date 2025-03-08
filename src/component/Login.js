import React, { useState, useEffect } from "react";
import { loginUser } from "../services/api";

const Login = ({ onLogin }) => {
  const [userAccessToken, setUserAccessToken] = useState("");
  const [userTokens, setUserTokens] = useState([]);

  useEffect(() => {
    const fetchUserTokens = async () => {
      try {
        const response = await fetch("/userTokens.json"); // Ensure the file is in public folder
        const data = await response.json();
        setUserTokens(data);
      } catch (error) {
        console.error("Error fetching user tokens:", error);
      }
    };

    fetchUserTokens();
  }, []);

  const handleLogin = async () => {
    try {
      const data = await loginUser(userAccessToken);
      console.log(data);
      if (data.accessToken) {
        onLogin(data.accessToken, data.user);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.log(error);
      alert("Error during login. Please check your token.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <select
        value={userAccessToken}
        onChange={(e) => setUserAccessToken(e.target.value)}
      >
        <option value="" disabled>
          Select a User
        </option>
        {userTokens.map((user, index) => (
          <option key={index} value={user.accessToken}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
