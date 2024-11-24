import React, { useState } from "react";
import { Box, Typography, Button, useTheme, Paper, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios"; // Import Axios for API requests

const LiveReportCard = ({ report, onAssignClick }) => {
  const theme = useTheme();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false); // State to manage the new dialog

  const [loading, setLoading] = useState(false);

  const handleOpenUpdateDialog = () => {
    setOpenUpdateDialog(true); // Open the new dialog
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false); // Close the new dialog
  };

  const handleUpdateReport = async (status) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5001/reports/${report._id}`, {
        priority: "completed",
        disasterStatus: status,
      });
      console.log(`Report updated successfully with status: ${status}`);
      setOpenUpdateDialog(false);
    } catch (error) {
      console.error("Error updating report:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Paper
      elevation={3}
      key={report._id}
      sx={{
        padding: "15px",
        marginBottom: "15px",
        backgroundColor: theme.palette.primary.light,
        cursor: "pointer",
        borderRadius: "8px",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(0.95)",
        },
      }}
    >
      <Typography variant="h6" color="text.primary" gutterBottom>
        {report.disasterCategory}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Location: {report.location}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        Description: {report.disasterInfo}
      </Typography>

      <Box display="flex" gap="8px" mt={2} flexWrap="wrap">
        {report.disasterImages.map((imageId) => (
          <img
            key={imageId}
            src={`http://localhost:5001/reports/image/${imageId}`}
            alt="Disaster"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        ))}
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={report.priority === "pending" ? handleOpenUpdateDialog : () => onAssignClick(report)}
          sx={{
            padding: "8px 16px",
            fontWeight: "bold",
            borderRadius: "20px",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          {report.priority === "pending" ? "Complete" : "Assign Rescuer"}
        </Button>
      </Box>

      {/* New Update Report Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Update Report
          <IconButton
            aria-label="close"
            onClick={handleCloseUpdateDialog}
            sx={{
              position: "absolute", // Makes it float in the top-right corner
              top: "8px", // Adjust vertical position
              right: "8px", // Adjust horizontal position
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary">
            Please select the status of the report:
          </Typography>
        </DialogContent>
        <DialogActions>
        <Button
            variant="contained"
            color="success"
            onClick={() => handleUpdateReport("success")}
            disabled={loading}
            sx={{ marginRight: "10px" }}
            >
            {loading ? "Loading..." : "Success"}
            </Button>
            <Button
            variant="contained"
            color="error"
            onClick={() => handleUpdateReport("failed")}
            disabled={loading}
            >
            {loading ? "Loading..." : "Failed"}
        </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};  

export default LiveReportCard;
