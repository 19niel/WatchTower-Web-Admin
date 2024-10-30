// client/src/components/PendingReportCard.jsx

import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Use old icon import
import CancelIcon from "@mui/icons-material/Cancel"; // Use old icon import
import { getImageUrlById } from "../utils/imageUtils"; // Ensure this utility function is accessible here
import ImagePreview from "./ImagePreview"; // Import your ImagePreview component
import AcceptReportForm from "./AcceptReportForm"; // Import the AcceptReportForm component

const PendingReportCard = ({ report, onActivate, onDelete }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false); // State to control the form modal

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < report.disasterImages.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleActivate = (id, comments) => {
    // Call the onActivate function passed as a prop with report ID and comments
    onActivate(id, comments);
  };

  return (
    <Box
      sx={{
        width: 300, // Set width for card
        p: 2,
        border: "1px solid gray",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Display the first disaster image */}
      <Box sx={{ height: 200, width: "100%", overflow: "hidden", borderRadius: 4 }}>
        <img
          src={getImageUrlById(report.disasterImages[0])} // Display first image
          alt="Disaster"
          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
          onClick={() => handleImageClick(0)} // Open preview on click
        />
      </Box>

      {/* Disaster details */}
      <Typography variant="h6">{report.disasterCategory}</Typography>
      <Typography variant="body2" color="textSecondary">
        {report.location}
      </Typography>
      <Typography variant="body2">{report.disasterInfo}</Typography>
      <Typography variant="caption" color="textSecondary">
        Reported By: {report.reportedBy}
      </Typography>

      {/* Action buttons */}
      <Box display="flex" justifyContent="space-between" mt={2} width="100%">
        <IconButton
          color="error"
          onClick={() => onDelete(report._id)}
          aria-label="delete report"
        >
          <CancelIcon fontSize="large" />
        </IconButton>
        <IconButton
          color="success"
          onClick={() => setFormOpen(true)} // Open the accept report form
          aria-label="activate report"
        >
          <CheckCircleIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Image preview modal */}
      <ImagePreview
        open={previewOpen}
        images={report.disasterImages.map(getImageUrlById)} // Get URLs for all images
        currentIndex={currentIndex}
        onClose={handleClosePreview}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {/* Accept report form modal */}
      <AcceptReportForm
        open={formOpen}
        onClose={() => setFormOpen(false)} // Close form
        onSubmit={handleActivate} // Handle form submission
        report={report} // Pass the report for any additional info
      />
    </Box>
  );
};

export default PendingReportCard;
