import React, { useEffect, useState } from "react";
import { Box, useTheme, Grid } from "@mui/material";
import Header from "components/Header";
import PendingReportCard from "../../components/PendingReportCard";

const PendingReports = () => {
  const theme = useTheme();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchPendingReports = async () => {
      try {
        const response = await fetch('http://localhost:5001/reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchPendingReports();
  }, []);

  // Filter reports to show only those with disasterStatus "unverified"
  const pendingReports = reports.filter(report => report.disasterStatus === "unverified");

  const handleActivate = async (id) => {
    try {
      await fetch(`http://localhost:5001/reports/${id}`, {
        method: "PATCH",  // Makes a PATCH request to update the report status
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disasterStatus: "verified",  // Update the status to verified
          priority: "low",  // Set the priority to low
        }),
      });
  
      // Update the state of the reports with the new priority and status
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === id
            ? { ...report, disasterStatus: "verified", priority: "low" }
            : report
        )
      );
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5001/reports/${id}`, { method: "DELETE" });
      setReports((prevReports) => prevReports.filter((report) => report._id !== id));
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Pending Reports" subtitle="Verify All the Reports Here" />
      <Box
        mt="40px"
        height="75vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid container spacing={2} p={2} overflow="auto">
          {pendingReports.map((report) => (
            <Grid item key={report._id}>
              <PendingReportCard
                report={report}
                onActivate={handleActivate}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PendingReports;
