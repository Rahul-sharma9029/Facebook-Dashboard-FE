import React, { useState, useEffect } from "react";
import "./AutomatePopup.css";
import { createMapping } from "../services/api";

const AutomatePopup = ({ pageDetails, ownerName, onClose }) => {
  const [pageName, setPageName] = useState("");
  const [channelId, setChannelId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [tags, setTags] = useState("");
  const [overlay, setOverlay] = useState(false);
  const [source, setSource] = useState("youtube");
  const [reactionPlaylistId, setReactionPlaylistId] = useState("");
  const [owner, setOwner] = useState(ownerName);
  const [reel, setReel] = useState(true);
  const [post, setPost] = useState(true);
  const [musicPlay, setMusicPlay] = useState(true);
  const [musicVideoLink, setMusicVideoLink] = useState("https://youtu.be/-gfsI06Cs28?si=tJFXtaM14L9_D250");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // To display the response message
  const [loading, setLoading] = useState(false); // Loader state
  const [showDefaults, setShowDefaults] = useState(false); // Slider state

  useEffect(() => {
    if (pageDetails) {
      setPageName(pageDetails.name || "");
      setAccessToken(pageDetails.access_token || "");
      setChannelId(pageDetails.channel_id || "");
    }
  }, [pageDetails]);

  const handleAutomate = async () => {
    setError("");
    setSuccess("");
    setResponseMessage("");
    setLoading(true); // Start the loader

    if (!pageName || !channelId || !accessToken) {
      setError("All fields are required.");
      setLoading(false); // Stop the loader
      return;
    }
    const requestData = {
      pageName,
      channelId,
      accessToken,
      tags,
      overlay,
      source,
      reactionPlaylistId,
      owner,
      reel,
      post,
      musicPlay,
      musicVideoLink,
    };

    try {
        
      const response = await createMapping(requestData);

      setResponseMessage(response.message || "Mapping created successfully!"); // Display API response
      setSuccess("Mapping created successfully!");
    } catch (err) {
      setError(err.message || "Failed to create mapping.");
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="header">
          <h3>Automate Page</h3>
          <div className="slider-container">
            <label className="switch">
              <input
                type="checkbox"
                checked={showDefaults}
                onChange={() => setShowDefaults(!showDefaults)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <label>
          Page Name:
          <input
            type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
          />
        </label>

        <label>
          Page Access Token:
          <input
            type="text"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            disabled
          />
        </label>

        <label>
          YouTube Channel ID:
          <input
            type="text"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          />
        </label>

        <label>
              Music Play:
              <div>
                <label>
                  <input
                    type="radio"
                    name="musicPlay"
                    value={true}
                    checked={musicPlay === true}
                    onChange={() => setMusicPlay(true)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="musicPlay"
                    value={false}
                    checked={musicPlay === false}
                    onChange={() => setMusicPlay(false)}
                  />{" "}
                  No
                </label>
              </div>
            </label>

        {showDefaults && (
          <>
            <label>
              Tags:
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>

            <label>
              Overlay:
              <div>
                <label>
                  <input
                    type="radio"
                    name="overlay"
                    value={true}
                    checked={overlay === true}
                    onChange={() => setOverlay(true)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="overlay"
                    value={false}
                    checked={overlay === false}
                    onChange={() => setOverlay(false)}
                  />{" "}
                  No
                </label>
              </div>
            </label>

            <label>
              Source:
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="youtube">YouTube</option>
              </select>
            </label>

            <label>
              Reaction Playlist ID:
              <input
                type="text"
                value={reactionPlaylistId}
                onChange={(e) => setReactionPlaylistId(e.target.value)}
              />
            </label>

            <label>
              Owner:
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </label>

            <label>
              Reel:
              <div>
                <label>
                  <input
                    type="radio"
                    name="reel"
                    value={true}
                    checked={reel === true}
                    onChange={() => setReel(true)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="reel"
                    value={false}
                    checked={reel === false}
                    onChange={() => setReel(false)}
                  />{" "}
                  No
                </label>
              </div>
            </label>

            <label>
              Post:
              <div>
                <label>
                  <input
                    type="radio"
                    name="post"
                    value={true}
                    checked={post === true}
                    onChange={() => setPost(true)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="post"
                    value={false}
                    checked={post === false}
                    onChange={() => setPost(false)}
                  />{" "}
                  No
                </label>
              </div>
            </label>

            {/* <label>
              Music Play:
              <div>
                <label>
                  <input
                    type="radio"
                    name="musicPlay"
                    value={true}
                    checked={musicPlay === true}
                    onChange={() => setMusicPlay(true)}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="musicPlay"
                    value={false}
                    checked={musicPlay === false}
                    onChange={() => setMusicPlay(false)}
                  />{" "}
                  No
                </label>
              </div>
            </label> */}

            <label>
              Music Video Link:
              <input
                type="text"
                value={musicVideoLink}
                onChange={(e) => setMusicVideoLink(e.target.value)}
              />
            </label>
          </>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="loading-text">Loading...</div>
          </div>
        )}

        {responseMessage && <p className="response">{responseMessage}</p>} {/* Response message */}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="buttons">
          <button onClick={handleAutomate} disabled={loading}>
            {loading ? "Processing..." : "Automate"}
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AutomatePopup;
