import React, { useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { useGetReportsTodayQuery } from "state/dashboardApi";
import { useGetReportsQuery } from "state/api";
import { getImageUrlById } from "../utils/imageUtils"; // Utility for image URLs

const MostReportInArea = ({ isDashboard = false }) => {
  const { data: reportsTodayData, isLoading: isLoadingToday } = useGetReportsTodayQuery();
  const { data: allReportsData, isLoading: isLoadingReports } = useGetReportsQuery();

  const theme = useTheme();

  // Flatten all report IDs from today into a single array
  const allReportIdsToday = [
    ...(reportsTodayData?.reportsByFloodToday?.reportIds || []),
    ...(reportsTodayData?.reportsByFireToday?.reportIds || []),
    ...(reportsTodayData?.reportsByTyphoonToday?.reportIds || []),
    ...(reportsTodayData?.reportsByOthersToday?.reportIds || []),
  ];

  // Filter Flood Reports
  const floodReportsToday = reportsTodayData?.reportsByFloodToday?.reportIds || [];
  
  // Map report IDs to their respective report objects
  const disasterReportsList = allReportIdsToday.map((id) => {
    return allReportsData?.find((r) => r._id === id) || null;
  });

  // State for the current report index
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoadingToday || isLoadingReports) return <Typography>Loading...</Typography>;

  // Navigate to the previous report
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? disasterReportsList.length - 1 : prevIndex - 1));
  };

  // Navigate to the next report
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === disasterReportsList.length - 1 ? 0 : prevIndex + 1));
  };

  const currentReport = disasterReportsList[currentIndex];

  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      gap="10px"
      alignItems="center"
      justifyContent="center"
      border="1px solid gray"
      borderRadius={4}
      p={2}
      backgroundColor={theme.palette.background.alt}
    >
      {/* Dynamic Title */}
      <Typography variant="h5" sx={{ color: theme.palette.secondary[300], marginBottom: "1rem" }}>
        Bonifacio Area: {floodReportsToday.length} Flood Reports Today
      </Typography>
  
      {currentReport ? (
        <>
          <Box
            sx={{
              height: 200,
              width: "100%",
              overflow: "hidden",
              borderRadius: 4,
            }}
          >
            <img
              src={getImageUrlById(currentReport.disasterImages[0])}
              alt="Disaster"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {currentReport.disasterCategory}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {currentReport.location}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {currentReport.disasterInfo}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Reported By: {currentReport.reportedBy}
          </Typography>
  
          {disasterReportsList.length > 1 && (
            <Box display="flex" gap="10px" mt="1rem">
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrevious}
                sx={{ textTransform: "none" }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ textTransform: "none" }}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Typography>No reports available.</Typography>
      )}
    </Box>
  );
};

export default MostReportInArea;
