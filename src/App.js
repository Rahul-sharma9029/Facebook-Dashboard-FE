import React, { useState } from "react";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogin = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  return (
    <div>
      {!accessToken ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <h1>Welcome, {user.name}</h1>
          <Dashboard accessToken={accessToken} userName={user.name}/>
        </>
      )}
    </div>
  );
};

export default App;
