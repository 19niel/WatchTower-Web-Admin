import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useGetReportsQuery } from "../state/api"; // Hook to get reports data
import SummarizeIcon from '@mui/icons-material/Summarize';

const ConsolidatedReports = () => {
  const theme = useTheme();
  const [reportsToday, setReportsToday] = useState({ Flood: 0, Fire: 0, Typhoon: 0, Others: 0 });

  // Fetch reports data
  const { data: reports, isLoading, error } = useGetReportsQuery();

  // Function to filter today's reports
  const isToday = (date) => {
    const today = new Date();
    const reportDate = new Date(date);
    return reportDate.toDateString() === today.toDateString(); // Compare only the date part
  };

  // Aggregate reports by category for today
  useEffect(() => {
    if (reports) {
      const updatedReports = { Flood: 0, Fire: 0, Typhoon: 0, Others: 0 };
      reports.forEach((report) => {
        if (isToday(report.createdAt)) {
          updatedReports[report.disasterCategory] += 1;
        }
      });
      setReportsToday(updatedReports);
    }
  }, [reports]);

  // Display loading or error states
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Error fetching Reports data.</Typography>;

  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="0.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <FlexBetween>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          Reports Happening Today
        </Typography>
        <SummarizeIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />
      </FlexBetween>

      {/* Grid Layout for 4 Columns */}
      <Box mt={2} display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
        {Object.keys(reportsToday).map((category) => (
          <Box
            key={category}
            display="flex"
            flexDirection="column"
            alignItems="center"
            backgroundColor={theme.palette.background.paper}
            padding="1rem"
            borderRadius="0.55rem"
            boxShadow={2}
            height="250px"
          >
            <Typography variant="h6" sx={{ color: theme.palette.secondary[300], mb: 1 }}>
              {category}
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
              {reportsToday[category]} reports
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ConsolidatedReports;
