import React, { useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { useGetReportsTodayQuery } from "state/dashboardApi";
import { useGetReportsQuery } from "state/api";

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

  // Map report IDs to their disasterInfo
  const disasterInfoList = allReportIdsToday.map((id) => {
    const report = allReportsData?.find((r) => r._id === id);
    return report ? report.disasterInfo : "Unknown disaster info";
  });

  // State for the current report index
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoadingToday || isLoadingReports) return <Typography>Loading...</Typography>;

  // Navigate to the previous report
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? disasterInfoList.length - 1 : prevIndex - 1));
  };

  // Navigate to the next report
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === disasterInfoList.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <Box
      height={isDashboard ? "400px" : "100%"}
      width={undefined}
      minHeight={isDashboard ? "325px" : undefined}
      minWidth={isDashboard ? "325px" : undefined}
      position="relative"
      display="flex"
      flexDirection="column"
      gap="10px"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h6" sx={{ color: theme.palette.primary.main, marginBottom: "1rem" }}>
        Reports Today:
      </Typography>

      {disasterInfoList.length > 0 ? (
        <Box
          p="10px"
          borderRadius="5px"
          sx={{ backgroundColor: theme.palette.background.alt, textAlign: "center" }}
        >
          <Typography>{disasterInfoList[currentIndex]}</Typography>
        </Box>
      ) : (
        <Typography>No reports available.</Typography>
      )}

      {disasterInfoList.length > 1 && (
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
    </Box>
  );
};

export default MostReportInArea;
