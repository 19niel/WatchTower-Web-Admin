import React, { useEffect, useState } from "react";
import { Box, useTheme, Typography, Paper, Dialog } from "@mui/material";
import Header from "components/Header";
import AssignRescuerForm from "components/AssignRescuerForm";
import axios from "axios";
import LiveReportCard from "components/LiveReportCard";

const LiveReports = () => {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [columns, setColumns] = useState({
    pending: { id: "pending", title: "On Progress", tasks: [] },
    high: { id: "high", title: "High Priority", tasks: [] },
    medium: { id: "medium", title: "Medium Priority", tasks: [] },
    low: { id: "low", title: "Low Priority", tasks: [] },
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5001/reports");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newColumns = {
      pending: { id: "pending", title: "On Progress", tasks: [] },
      high: { id: "high", title: "High Priority", tasks: [] },
      medium: { id: "medium", title: "Medium Priority", tasks: [] },
      low: { id: "low", title: "Low Priority", tasks: [] },
    };

    reports.forEach((report) => {
      if (report.priority === "active") return;

      if (report.disasterStatus === "verified") {
        if (report.priority === "high") {
          newColumns.high.tasks.push(report);
        } else if (report.priority === "medium") {
          newColumns.medium.tasks.push(report);
        } else if (report.priority === "low") {
          newColumns.low.tasks.push(report);
        } else {
          newColumns.pending.tasks.push(report);
        }
      }
    });

    setColumns(newColumns);
  }, [reports]);

  const handleOpenDialog = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Live Reports" subtitle="See All The Live Reports Today" />
      <Box
        mt="40px"
        display="flex"
        justifyContent="space-between"
        height="78vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
        padding="10px"
      >
        {Object.values(columns).map((column) => (
          <Box
            key={column.id}
            flex={1}
            margin="0 10px"
            display="flex"
            flexDirection="column"
            border={`1px solid ${theme.palette.secondary[200]}`}
            borderRadius="4px"
            padding="10px"
            sx={{
              // put your styles here
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              sx={{
                textTransform: "uppercase",
                fontWeight: "bold",
                color: theme.palette.secondary[100],  // Title color
                backgroundColor: column.id === "low"
                  ? "#C7AE6F" // Low: #F7E3AF
                  : column.id === "medium"
                  ? "#FF8F3A" // Medium: #FF8F3A
                  : column.id === "high"
                  ? "#F12E4B" // High: #F12E4B
                  : column.id === "pending"
                  ? "#51A072" // Active (On Progress): #51A072
                  : "#f5c6cb", // Default color (fallback)
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              {column.title}
            </Typography>

            <Paper elevation={1} style={{ flexGrow: 1, overflowY: "auto" }}>
              {column.tasks.length === 0 ? (
                <Typography variant="body2" color="textSecondary" align="center">
                  No tasks
                </Typography>
              ) : (
                column.tasks.map((report) => (
                  <LiveReportCard
                    key={report._id}
                    report={report}
                    onAssignClick={handleOpenDialog}
                  />
                ))
              )}
            </Paper>
          </Box>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <AssignRescuerForm onClose={handleCloseDialog} report={selectedReport} />
      </Dialog>
    </Box>
  );
};

export default LiveReports;
