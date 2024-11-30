// client/src/components/PendingReportCard.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // For activating reports
import CancelIcon from "@mui/icons-material/Cancel"; // For deleting reports
import { getImageUrlById } from "../utils/imageUtils"; // Utility function for image URLs
import ImagePreview from "./ImagePreview"; // Component for previewing images
import AcceptReportForm from "./AcceptReportForm"; // Component for accepting a report
import axios from "axios"; // For making API requests
import { useDeleteReportMutation } from "state/reportApi";

const PendingReportCard = ({ report, onActivate }) => {
  const [previewOpen, setPreviewOpen] = useState(false); // State for image preview
  const [currentIndex, setCurrentIndex] = useState(0); // Current image index
  const [formOpen, setFormOpen] = useState(false); // State for the AcceptReportForm modal
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for the delete confirmation dialog

  // Handles image preview open
  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setPreviewOpen(true);
  };

  // Handles closing the image preview modal
  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  // Handles navigation to the next image
  const handleNext = () => {
    if (currentIndex < report.disasterImages.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Handles navigation to the previous image
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Handles activating a report
  const handleActivate = (id, comments) => {
    onActivate(id, comments); // Call the parent-provided function
  };

  // Handles deleting a report
  const [deleteReport] = useDeleteReportMutation();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(report._id).unwrap();
        window.location.reload(); // Force the page to reload and fetch the latest reports
      } catch (error) {
        console.error("Error deleting report:", error.response?.data || error.message);
      }
    }
  };

  // Handles canceling the delete action
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Box
      sx={{
        width: 300,
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
          src={getImageUrlById(report.disasterImages[0])}
          alt="Disaster"
          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
          onClick={() => handleImageClick(0)}
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
          onClick={() => setDeleteDialogOpen(true)} // Open delete confirmation dialog
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
        onClose={() => setFormOpen(false)} // Close form modal
        onSubmit={handleActivate} // Call the activate handler
        report={report} // Pass report data
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            Are you sure you want to delete this report? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingReportCard;
