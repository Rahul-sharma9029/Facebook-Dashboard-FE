import React, { useState } from "react";
import { loginUser } from "../services/api";

const Login = ({ onLogin }) => {
  const [userAccessToken, setUserAccessToken] = useState("");

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
      <input
        type="text"
        placeholder="Enter User Access Token"
        value={userAccessToken}
        onChange={(e) => setUserAccessToken(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
