// client/src/components/PendingReportCard.jsx

import React, { useState } from "react";
import { Box, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; 
import CancelIcon from "@mui/icons-material/Cancel"; 
import { getImageUrlById } from "../utils/imageUtils"; 
import ImagePreview from "./ImagePreview"; 
import AcceptReportForm from "./AcceptReportForm"; 

const PendingReportCard = ({ report, onActivate, onDelete }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false); 
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State to control the delete confirmation dialog

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
    onActivate(id, comments);
  };

  const handleDelete = () => {
    onDelete(report._id); // Call the onDelete function passed as a prop
    setDeleteDialogOpen(false); // Close the delete dialog after deletion
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false); // Close the delete dialog without deleting
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
        onClose={() => setFormOpen(false)} 
        onSubmit={handleActivate} 
        report={report} 
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
