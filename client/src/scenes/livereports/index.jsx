import React, { useEffect, useState } from "react"; 
import { Box, useTheme, Typography, Paper, Button, Dialog } from "@mui/material";
import Header from "components/Header";
import AssignRescuerForm from "components/AssignRescuerForm"; // Import the dialog form component
import axios from "axios";

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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5001/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const newColumns = {
      pending: { id: "pending", title: "On Progress", tasks: [] },
      high: { id: "high", title: "High Priority", tasks: [] },
      medium: { id: "medium", title: "Medium Priority", tasks: [] },
      low: { id: "low", title: "Low Priority", tasks: [] },
    };

    reports.forEach((report) => {
      // Skip reports with "active" priority
      if (report.priority === "active") return;

      // Categorize reports based on priority and status
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
          >
            <Typography variant="h6" gutterBottom>
              {column.title}
            </Typography>
            <Paper elevation={1} style={{ flexGrow: 1, overflowY: "auto" }}>
              {column.tasks.length === 0 ? (
                <Typography variant="body2" color="textSecondary" align="center">
                  No tasks
                </Typography>
              ) : (
                column.tasks.map((report) => (
                  <Box
                    key={report._id}
                    padding="5px"
                    borderRadius="4px"
                    marginBottom="5px"
                    bgcolor={theme.palette.primary.light}
                    style={{ cursor: "default" }}
                  >
                    <Typography variant="body1">{report.disasterCategory}</Typography>
                    <Typography variant="body2">{report.location}</Typography>
                    <Typography variant="body2">{report.disasterInfo}</Typography>
                    <Box display="flex" gap="8px" mt={1}>
                      {report.disasterImages.map((imageId) => (
                        <img
                          key={imageId}
                          src={`http://localhost:5001/reports/image/${imageId}`}
                          alt="Disaster"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      ))}
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenDialog(report)}
                      style={{ marginTop: "8px" }}
                    >
                      Assign Rescuer
                    </Button>
                  </Box>
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
