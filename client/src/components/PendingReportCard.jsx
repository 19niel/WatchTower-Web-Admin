// client/src/components/PendingReportCard.jsx
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const PendingReportCard = ({ report, onActivate, onDelete }) => {
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
      <Box sx={{ height: 200, width: "100%", overflow: "hidden", borderRadius: 4 }}>
        <img
          src={`/api/reports/image/${report.disasterImages[0]}`}
          alt="Disaster"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Typography variant="h6">{report.disasterCategory}</Typography>
      <Typography variant="body2" color="textSecondary">
        {report.location}
      </Typography>
      <Typography variant="body2">{report.disasterInfo}</Typography>
      <Typography variant="caption" color="textSecondary">
        Reported By: {report.reportedBy}
      </Typography>
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
          onClick={() => onActivate(report._id)}
          aria-label="activate report"
        >
          <CheckCircleIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PendingReportCard;
