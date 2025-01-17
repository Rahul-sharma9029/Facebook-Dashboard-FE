import React, { useEffect, useState } from "react";
import { fetchPages, fetchPageReels, fetchPageVideos } from "../services/api";
import ReelPopup from "./ReelPopup";
import AutomatePopup from "./AutomatePopup";
import "./Dashboard.css"; // Import CSS for styling

const Dashboard = ({ accessToken }) => {
  const [isLoading, setIsLoading] = useState(false); // Loader state for page loading
  const [popupLoading, setPopupLoading] = useState(false); // Loader state for popup loading
  const [pages, setPages] = useState([]);
  const [pageDetails, setPageDetails] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null); // State for the selected page to show reels/videos
  const [automationPage, setAutomationPage] = useState(null); // State for the page selected for automation
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPages(accessToken);
        const pages = data.pages || [];
        setPages(pages);

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
    setAutomationPage(page);
  };

  const closePopup = () => setSelectedPage(null);
  const closeAutomationPopup = () => setAutomationPage(null);

  const truncateTitle = (title) => {
    const words = title.split(" ");
    return words.length > 4 ? words.slice(0, 4).join(" ") + "..." : title;
  };

  return (
    <div className="dashboard">
      <h2>Facebook Pages Dashboard</h2>

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
                <th>#</th>
                <th>Page ID</th>
                <th>Page Name</th>
                {/* Merge column headers for "Most Recent Video" */}
                <th colSpan="3" className="reel-column">
                  Most Recent Video
                </th>
                {/* Merge column headers for "Most Viewed Video" */}
                <th colSpan="3" className="reel-column">
                  Most Viewed Video
                </th>
                <th>Actions</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th className="reel-column">Reel Title</th>
                <th className="reel-column">Views</th>
                <th className="reel-column">Timestamp</th>
                <th className="reel-column">Reel Title</th>
                <th className="reel-column">Views</th>
                <th className="reel-column">Timestamp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageDetails.map((page, index) => (
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
                    <td>{page.details?.mostRecentReel?.views || "N/A"}</td>
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
                    <td>{page.details?.mostViewedReel?.views || "N/A"}</td>
                    <td>
                      {page.details?.mostViewedReel?.created_time
                        ? new Date(page.details.mostViewedReel.created_time).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      <div className="action-btn-container">
                        <button className="action-btn" onClick={() => openPopup(page)} disabled={popupLoading}>
                          {popupLoading ? "Loading..." : "Show All Reels"}
                        </button>
                        <button className="action-btn" onClick={() => openAutomationPopup(page)}>
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
        <AutomatePopup pageDetails={automationPage} onClose={closeAutomationPopup} />
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
