import React, { useState } from "react";
import { loginUser } from "../services/api";

const Login = ({ onLogin }) => {
  const [userAccessToken, setUserAccessToken] = useState("");

  // Replace this JSON array with the actual data you have
  const userTokens = [
    { name: "Rahul sharma", accessToken: "EAASLIITO28MBOZBmmNHclta0AYCjeBk2f0Y5jtf9Ac1I24KbJJYrH1Czp5oM1qenqUOTal1H2h3JMOBFWlO6P1J7R5ZAL7gKEUSMMQFJZB8JGIVgHqL7mjFqgixjZBsCtQhOmuY9y7LX8OKLLOjA3Km5E4Cpp6ZBnFC0RRmqmnvxfZAa6rzZB0MB8Ox" },
    {name: "Rohan sharma", accessToken: "EAAOEkxnaCFwBO8tTFAGOcNJbP01MZCPqymXeZBhLLQ6kB9aGcqbdNB765BILU3ZADxZAwYBXlWsQmQ81NgJZAnWbh4ILiJhb23Ya7yrMhNGSszr4sOG41jhWDL1COUSFvIVB8hr2IzAmJpdG3sWioZAdwHdc7ZCCoLXKxsc0nTdozHU7cKqSjqzJ14m"},
    {name: "Ajay sharma", accessToken: "EAAMrQ0HB8tUBO1yXDkuWDz51VVPo9ZCYMSKry3lHd3DOc1YkZB4oF7SKMjTArSr5p2YtvidzRIC8hGKZA2QrXVEJBLAitALWZB9MMoLsO8BVbqqWzNKrPSh7lvmWygQTZCY31nifyddEhjthP9flPQaXQelxFOzdwGQDFSbl2bQjA7IIeMEcgmZBnC"},
    {name: "Tamania ", accessToken: "EAAQ87RLfF5MBO1PFLQUEuQQbQMxAkOmWEhBy6z9JVYZCAzsFEbU0V0ily5jNpy9Vg4o2mhQsqDXlUByROaxcKCgZAPYYtSERw9JNGzdxUgcR6dlMqSeMDd5fWaoNn4qcHiCpOW3Kt4ZCjMtmPSTBHZCVPsA8LE7qRW0qXfFQ9DzIKtEZA6ZBQ5cZBQZCmm0h5XfP2lsIF3La"},
    {name: "Dhony deve-Gemstock", accessToken:"EAAQpVTTGZCFEBO5n55lGxZCOr1NqMNpdsBnVsCdocBVBOwrUIOZAQLTwfZCPz0VIihQcRqs7FDEqamJ4KUZA1osvamDAH0Osw7caKonIErGDO3v3t7dtF6kYs1fbwSl7wox94ZBnQZBeoPuUEZACQvLcrZBScI0YW9zY5jbKuiYPZAS3n4blLH40DsZBZC8HPc0o6hYIzvZCi2SdUlvgHh3AW"},
    {name: "Issac Dave", accessToken:"EAAP5I3Pc8jgBO0UuQSVXT8jmUBLRg5DgL9dLgR4XMqZCUpkfeie3PTHM7ES7NfJK6vHTzVFUQYZClm6f1ctHo6mHLPwklRRwjKFFVcIsFFcdA5JgFRSXJExRXiZAX5hqB951IFyBvcxWA5owZB9l1CzReZAuRcU5QaV9kFKcmGHlUyzqIpOJn15OOpMuupg9hNO67y944e0Nu4eHf"}
  
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
