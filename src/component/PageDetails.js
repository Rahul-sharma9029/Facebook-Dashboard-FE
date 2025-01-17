import React, { useEffect, useState } from "react";
import { fetchPageDetails } from "../services/api";

const PageDetails = ({ page }) => {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchPageDetails(page.id, page.access_token);
        setDetails(data);
      } catch (err) {
        setError("Error fetching page details.");
      }
    };

    fetchDetails();
  }, [page]);

  if (error) return <p>{error}</p>;

  if (!details) return <p>Loading...</p>;

  const { pageDetails, posts } = details;
  const mostRecentPost = posts[0];
  const mostReachedPost = posts.reduce((max, post) => (post.reach > max.reach ? post : max), posts[0]);

  return (
    <div>
      <h3>{pageDetails.name}</h3>
      <p>Fan Count: {pageDetails.fan_count}</p>
      <p>Monetization Status: {pageDetails.monetization_status}</p>

      <h4>Most Recent Post:</h4>
      {mostRecentPost ? (
        <p>
          Message: {mostRecentPost.message || "No message"} <br />
          Created Time: {new Date(mostRecentPost.created_time).toLocaleString()}
        </p>
      ) : (
        <p>No posts available</p>
      )}

      <h4>Most Reached Post:</h4>
      {mostReachedPost ? (
        <p>
          Message: {mostReachedPost.message || "No message"} <br />
          Created Time: {new Date(mostReachedPost.created_time).toLocaleString()}
        </p>
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default PageDetails;
