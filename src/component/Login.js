import React, { useState } from "react";
import { loginUser } from "../services/api";

const Login = ({ onLogin }) => {
  const [userAccessToken, setUserAccessToken] = useState("");

  // Replace this JSON array with the actual data you have
  const userTokens = [
    { name: "Rahul sharma", accessToken: "EAASLIITO28MBOZBmmNHclta0AYCjeBk2f0Y5jtf9Ac1I24KbJJYrH1Czp5oM1qenqUOTal1H2h3JMOBFWlO6P1J7R5ZAL7gKEUSMMQFJZB8JGIVgHqL7mjFqgixjZBsCtQhOmuY9y7LX8OKLLOjA3Km5E4Cpp6ZBnFC0RRmqmnvxfZAa6rzZB0MB8Ox" },
  ];

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
