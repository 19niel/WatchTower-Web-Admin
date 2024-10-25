// client/src/scenes/pendingreports/index.jsx

import React, { useEffect, useState } from "react";
import { Box, useTheme, Grid } from "@mui/material"; // Import Grid for layout
import Header from "components/Header";
import PendingReportCard from "../../components/PendingReportCard"; // Adjust path as necessary

const PendingReports = () => {
  const theme = useTheme();
  const [pendingReports, setPendingReports] = useState([]);

  useEffect(() => {
    // Fetch pending reports from your API
    const fetchPendingReports = async () => {
      try {
        const response = await fetch('/api/reports/pending'); // Adjust the endpoint as needed
        const data = await response.json();
        setPendingReports(data); // Set the fetched reports to state
      } catch (error) {
        console.error('Error fetching pending reports:', error);
      }
    };

    fetchPendingReports();
  }, []);

  const handleActivate = (id) => {
    // Logic to activate report
    console.log(`Activating report with ID: ${id}`);
    // Call your API to update the report status here
  };

  const handleDelete = (id) => {
    // Logic to delete report
    console.log(`Deleting report with ID: ${id}`);
    // Call your API to delete the report here
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
