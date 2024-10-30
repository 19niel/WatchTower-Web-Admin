// client/src/components/AcceptReportForm.jsx

import React from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";

const AcceptReportForm = ({ open, onClose, onSubmit, report }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(report._id); // Call the onSubmit prop with report ID only
    onClose(); // Close the form
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 4, width: 300 }}>
        <Typography variant="h6">Accept Report</Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="body2">
            Are you sure you want to accept this report?
          </Typography>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Accept
          </Button>
          <Button onClick={onClose} variant="outlined" sx={{ ml: 1, mt: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Dialog>
  );
};

export default AcceptReportForm;
