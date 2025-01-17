import React, { useState, useEffect } from "react";
import "./ReelPopup.css";

const ReelPopup = ({ page, reels, videos, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState("views"); // Initially sort by views
  const [sortOrder, setSortOrder] = useState("highToLow"); // Sorting order (High to Low or Low to High)
  const recordsPerPage = 20;

  // Combine and process records to determine type
  const processRecords = (records) => {
    return records.map((record) => ({
      ...record,
      type: record.permalink_url?.toLowerCase().includes("reel") ? "REEL" : "POSTED VIDEOS",
    }));
  };

  const allRecords = processRecords([...reels, ...videos]);
  const totalRecords = allRecords.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  // Format views as 1k, 2k, etc.
  const formatViews = (views) => {
    if (views > 1000) {
      return (views / 1000).toFixed(1) + "k";
    }
    return views;
  };

  // Sort records based on selected criteria (Views or Uploaded On)
  const sortRecords = (records) => {
    return records.sort((a, b) => {
      let aValue = a[sortCriteria] || (sortCriteria === "views" ? 0 : new Date(0));
      let bValue = b[sortCriteria] || (sortCriteria === "views" ? 0 : new Date(0));

      if (sortCriteria === "views") {
        aValue = a.views || 0;
        bValue = b.views || 0;
      } else if (sortCriteria === "created_time") {
        aValue = new Date(a.created_time);
        bValue = new Date(b.created_time);
      }

      if (sortOrder === "highToLow") {
        return bValue - aValue; // High to Low
      } else {
        return aValue - bValue; // Low to High
      }
    });
  };

  const sortedRecords = sortRecords(allRecords);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = sortedRecords.slice(startIndex, startIndex + recordsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "highToLow" ? "lowToHigh" : "highToLow");
  };

  const handleSortCriteriaChange = (e) => {
    setSortCriteria(e.target.value);
    setSortOrder("highToLow"); // Default to High to Low after changing criteria
  };

  useEffect(() => {
    // When the component mounts, set default sorting to views (high to low)
    setSortCriteria("views");
    setSortOrder("highToLow");
  }, []);

  return (
    <div className="reel-popup">
      <div className="popup-content">
        <h3 className="popup-title">Reels and Videos for {page.name}</h3>
        
        {/* Dropdown for sorting criteria */}
        <div className="sorting-dropdown">
          <label htmlFor="sortCriteria">Sort by: </label>
          <select
            id="sortCriteria"
            value={sortCriteria}
            onChange={handleSortCriteriaChange}
          >
            <option value="views">Views</option>
            <option value="created_time">Uploaded On</option>
          </select>
        </div>

        <table className="popup-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              {/* Views column */}
              <th
                onClick={sortCriteria === "views" ? toggleSortOrder : null}
              >
                Views{" "}
                {sortCriteria === "views" && (
                  <span>
                    ({sortOrder === "highToLow" ? "High to Low" : "Low to High"})
                  </span>
                )}
              </th>
              {/* Uploaded On column */}
              <th
                onClick={sortCriteria === "created_time" ? toggleSortOrder : null}
              >
                Uploaded On{" "}
                {sortCriteria === "created_time" && (
                  <span>
                    ({sortOrder === "highToLow" ? "Newest to Oldest" : "Oldest to Newest"})
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={record.id}>
                <td>{startIndex + index + 1}</td>
                <td>{record.title || "No title"}</td>
                <td>{record.type}</td>
                <td>{formatViews(record.views) || "N/A"}</td>
                <td>
                  {record.created_time
                    ? new Date(record.created_time).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Showing {startIndex + 1}-{startIndex + currentRecords.length} of {totalRecords} records
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>

        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ReelPopup;
