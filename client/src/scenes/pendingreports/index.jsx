import React, { useEffect, useState } from "react";
import { Box, useTheme, Grid } from "@mui/material";
import { LoadScript } from "@react-google-maps/api"; // Import LoadScript here
import Header from "components/Header";
import PendingReportCard from "../../components/PendingReportCard";
import AcceptReportForm from "../../components/AcceptReportForm";

const PendingReports = () => {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchPendingReports = async () => {
      try {
        const response = await fetch("http://localhost:5001/reports");
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchPendingReports();
  }, []);

  const pendingReports = reports.filter(
    (report) => report.disasterStatus === "unverified"
  );

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disasterStatus: "verified", priority: "active" }),
      });

      if (response.ok) {
        setReports((prevReports) =>
          prevReports.filter((report) => report._id !== id)
        );
      } else {
        console.error("Failed to verify and activate report");
      }
    } catch (error) {
      console.error("Error verifying and activating report:", error);
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

  const openForm = (report) => {
    setSelectedReport(report);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedReport(null);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
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
                  onActivate={() => openForm(report)}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {selectedReport && (
          <AcceptReportForm
            open={isFormOpen}
            onClose={closeForm}
            onSubmit={handleActivate}
            report={selectedReport}
          />
        )}
      </Box>
    </LoadScript>
  );
};

export default PendingReports;
