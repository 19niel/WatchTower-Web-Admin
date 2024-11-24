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

  const handleActivate = async (id, disasterCategory, disasterInfo) => {
    try {
      const aiResponse = await fetch('http://localhost:5001/ai/priority', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disasterCategory, disasterInfo }),
      });

      const aiData = await aiResponse.json();

      if (aiResponse.ok) {
        const { priority } = aiData;

        await fetch(`http://localhost:5001/reports/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            disasterStatus: "verified",
            priority,
          }),
        });

        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === id ? { ...report, disasterStatus: "verified", priority } : report
          )
        );
      } else {
        console.error("AI Error:", aiData.error);
      }
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
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          display="flex"
          overflow="auto"
          width="100%"
          p={2}
          sx={{
            '&::-webkit-scrollbar': { height: '8px' },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.primary.light,
              borderRadius: '4px',
            },
          }}
        >
          {pendingReports.map((report) => (
            <Box key={report._id} mr={2}>
              <PendingReportCard
                report={report}
                onActivate={() => handleActivate(report._id, report.disasterCategory, report.disasterInfo)}
                onDelete={handleDelete}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PendingReports;
