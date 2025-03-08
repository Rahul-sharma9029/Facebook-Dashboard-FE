import React, { useEffect, useState } from "react";
import { FaSortUp, FaSortDown } from 'react-icons/fa'; 
import { fetchPages, fetchPageReels, fetchPageVideos } from "../services/api";
import ReelPopup from "./ReelPopup";
import AutomatePopup from "./AutomatePopup";
import "./Dashboard.css"; // Import CSS for styling

const Dashboard = ({ accessToken, userName  }) => {
  const [isLoading, setIsLoading] = useState(false); // Loader state for page loading
  const [popupLoading, setPopupLoading] = useState(false); // Loader state for popup loading
  const [pageDetails, setPageDetails] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null); // State for the selected page to show reels/videos
  const [automationPage, setAutomationPage] = useState(null); // State for the page selected for automation
  const [error, setError] = useState(""); // Error state
  const [sortBy, setSortBy] = useState(null); // State for sorting criteria (e.g., name, mostRecentViews, mostViewedViews)
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order (asc or desc)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPages(accessToken);
        const pages = data.pages || [];

        const detailsPromises = pages.map((page) =>
          fetchPageReels(page.id, page.access_token)
            .then((details) => ({ ...page, details }))
            .catch(() => ({ ...page, error: "Error fetching reels data" }))
        );

        const resolvedDetails = await Promise.all(detailsPromises);
        setPageDetails(resolvedDetails);
      } catch (err) {
        setError("Error fetching pages or their details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) fetchPageData();
  }, [accessToken]);

  const openPopup = async (page) => {
    setPopupLoading(true); // Show loader for popup
    try {
      const [reelsData, videosData] = await Promise.all([
        fetchPageReels(page.id, page.access_token),
        fetchPageVideos(page.id, page.access_token),
      ]);

      setSelectedPage({
        ...page,
        reels: reelsData.allReels || [],
        videos: videosData.data || [],
      });
    } catch (err) {
      setError("Error fetching reels/videos for the selected page.");
    } finally {
      setPopupLoading(false); // Hide loader after data is loaded
    }
  };

  const openAutomationPopup = (page) => {
    console.log("owner name 2 on dashboard : ",userName);
    setAutomationPage(page);
  };

  const closePopup = () => setSelectedPage(null);
  const closeAutomationPopup = () => setAutomationPage(null);

  const truncateTitle = (title) => {
    const words = title.split(" ");
    return words.length > 4 ? words.slice(0, 4).join(" ") + "..." : title;
  };

  const handleSort = (sortKey) => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortBy(sortKey);
  };
  const formatViews = (views) => {
    if (!views) return "N/A";
    const num = parseInt(views, 10);
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };
  const sortData = (data) => {
    if (!sortBy) return data;

    const sortOrderMultiplier = sortOrder === "asc" ? 1 : -1;

    return data.slice().sort((a, b) => {
      switch (sortBy) {
        case "name":
          return sortOrderMultiplier * (a.name.localeCompare(b.name));
        case "mostRecentViews":
          return (
            sortOrderMultiplier *
            (parseInt(a.details?.mostRecentReel?.views) -
              parseInt(b.details?.mostRecentReel?.views) ||
              (new Date(a.details?.mostRecentReel?.created_time) -
                new Date(b.details?.mostRecentReel?.created_time)))
          );
        case "mostViewedViews":
          return (
            sortOrderMultiplier *
            (parseInt(a.details?.mostViewedReel?.views) -
              parseInt(b.details?.mostViewedReel?.views) ||
              (new Date(a.details?.mostViewedReel?.created_time) -
                new Date(b.details?.mostViewedReel?.created_time)))
          );
        case "mostRecentTimestamp":
          return (
            sortOrderMultiplier *
            (new Date(a.details?.mostRecentReel?.created_time) -
              new Date(b.details?.mostRecentReel?.created_time))
          );
        case "mostViewedTimestamp":
          return (
            sortOrderMultiplier *
            (new Date(a.details?.mostViewedReel?.created_time) -
              new Date(b.details?.mostViewedReel?.created_time))
          );
        default:
          return data;
      }
    });
  };

  return (
    <div className="dashboard">
      <h2>Facebook Pages Dashboard</h2>

      <div className="sort-container">
        <select
          value={sortBy || ""}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="name">Page Name</option>
          <option value="mostRecentViews">Most Recent Video Views</option>
          <option value="mostViewedViews">Most Viewed Video Views</option>
          <option value="mostRecentTimestamp">Most Recent Video Timestamp</option>
          <option value="mostViewedTimestamp">Most Viewed Video Timestamp</option>
        </select>
      </div>

      {!accessToken ? (
        <button
          className="login-btn"
          onClick={() => window.location.reload()}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Login to Fetch Pages"}
        </button>
      ) : (
        <div className="table-container">
          <table className="page-table">
            <thead>
              <tr>
              <th rowSpan="2">#</th>
                <th rowSpan="2">Page ID</th>
                <th rowSpan="2" onClick={() => handleSort("name")}>
                  Page Name {sortBy === "name" && (
                    <span className="sort-icon">{sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}</span>
                  )}
                </th>
                {/* Merge column headers for "Most Recent Video" */}
                <th colSpan="3" className="reel-column">
                  Most Recent Video
                </th>
                {/* Merge column headers for "Most Viewed Video" */}
                <th colSpan="3" className="reel-column">
                  Most Viewed Video
                </th>
                <th rowSpan="2">Actions</th>
              </tr>
              <tr>
                <th className="reel-column">Reel Title</th>
                <th
                  className="reel-column"
                  onClick={() => handleSort("mostRecentViews")}
                >
                  Views {sortBy === "mostRecentViews" && (
                   <span className="sort-icon">{sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}</span>
                  )}
                </th>
                <th
                  className="reel-column"
                  onClick={() => handleSort("mostRecentTimestamp")}
                >
                  Timestamp {sortBy === "mostRecentTimestamp" && (
                    <span className="sort-icon">{sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}</span>
                  )}
                </th>
                <th className="reel-column">Reel Title</th>
                <th
                  className="reel-column"
                  onClick={() => handleSort("mostViewedViews")}
                >
                  Views {sortBy === "mostViewedViews" && (
                    <span className="sort-icon">{sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}</span>
                  )}
                </th>
                <th
                  className="reel-column"
                  onClick={() => handleSort("mostViewedTimestamp")}
                >
                  Timestamp {sortBy === "mostViewedTimestamp" && (
                    <span className="sort-icon">{sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortData(pageDetails).map((page, index) => (
                <React.Fragment key={page.id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{page.id}</td>
                    <td>{page.name}</td>
                    <td className="reel-title" title={page.details?.mostRecentReel?.title || "No title"}>
                      {page.details?.mostRecentReel?.title
                        ? truncateTitle(page.details.mostRecentReel.title)
                        : "No title"}
                    </td>
                    <td>{formatViews(page.details?.mostRecentReel?.views) || "N/A"}</td>
                    <td>
                      {page.details?.mostRecentReel?.created_time
                        ? new Date(page.details.mostRecentReel.created_time).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="reel-title" title={page.details?.mostViewedReel?.title || "No title"}>
                      {page.details?.mostViewedReel?.title
                        ? truncateTitle(page.details.mostViewedReel.title)
                        : "No title"}
                    </td>
                    <td>{formatViews(page.details?.mostViewedReel?.views) || "N/A"}</td>
                    <td>
                      {page.details?.mostViewedReel?.created_time
                        ? new Date(page.details.mostViewedReel.created_time).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      <div className="action-btn-container">
                        <button
                          className="action-btn"
                          onClick={() => openPopup(page)}
                          disabled={popupLoading}
                        >
                          {popupLoading ? "Loading..." : "Show All Reels"}
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => openAutomationPopup(page,userName)}
                        >
                          Automate
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPage && (
        <ReelPopup
          page={selectedPage}
          reels={selectedPage.reels}
          videos={selectedPage.videos}
          onClose={closePopup}
        />
      )}

      {automationPage && (
        <AutomatePopup pageDetails={automationPage} ownerName={userName} onClose={closeAutomationPopup} />
      )}

      {error && <p className="error">{error}</p>}

      {/* Loader for whole page when data is being loaded */}
      {(isLoading || popupLoading) && (
        <div className="overlay">
          <div className="loader">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
