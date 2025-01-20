import axios from "axios";

const BASE_URL = "https://essentials-dashboard-be-fz9xi7-456e25-46-202-152-148.traefik.me";
// const BASE_URL = "http://localhost:8080";

export const loginUser = async (userAccessToken) => {
    debugger
    console.log(userAccessToken);
    const response = await fetch(`${BASE_URL}/auth/api/login`, {
      method: "POST", // POST method is used to send data in the body
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAccessToken }), // Send the access token in the body
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  
    return response.json(); // Return parsed JSON data
  };
  

export const fetchPages = async (userAccessToken) => {
  const response = await fetch(`${BASE_URL}/api/pages?userAccessToken=${userAccessToken}`);
  return response.json();
};

export // api.js

const fetchPageDetails = async (pageId, pageAccessToken) => {
  try {
    const response = await fetch(`${BASE_URL}/api/pages/${pageId}/details?access_token=${pageAccessToken}`);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Error fetching page details.");
    }
  } catch (error) {
    console.error("Error fetching page details:", error);
    throw error;
  }
};

export const fetchPageReels = async (pageId, pageAccessToken) => {
  console.log(pageId,pageAccessToken);
  const response = await axios.get(
    `${BASE_URL}/api/pages/${pageId}?&pageAccessToken=${pageAccessToken}`
  );
  return response.data;
};


export const fetchPageVideos = async (pageId, pageAccessToken) => {
  const url = `https://graph.facebook.com/v21.0/${pageId}/videos`;
  try {
    const response = await axios.get(url, {
      params: {
        access_token: pageAccessToken,
        fields: "id,title,description,length,created_time,thumbnails,permalink_url,content_category,views",
        limit: 250,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw new Error("Failed to fetch videos for the page.");
  }
};


export const createMapping = async (pageName, channelId, accessToken) => {
  try {
    const response = await fetch(`${BASE_URL}/api/automation/create-mapping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pageName, channelId, accessToken }),
    });
    console.log(response);
    
    if (!response.ok) {
      throw new Error("Failed to create mapping");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createMapping:", error.message);
    throw error;
  }
};






