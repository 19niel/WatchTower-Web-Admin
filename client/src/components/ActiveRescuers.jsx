import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { useGetRescuersQuery } from "../state/api"; // Import the hook

const ActiveRescuers = () => {
  const theme = useTheme();

  // Fetch rescuers data
  const { data: rescuers, isLoading, error } = useGetRescuersQuery();

  // Function to determine the color based on the status
  const getStatusColor = (status) => {
    if (status === "active") return theme.palette.success.main;
    if (status === "occupied") return theme.palette.warning.main;
    if (status === "offline") return theme.palette.error.main;
    return theme.palette.text.primary; // Default color
  };

  // Display loading or error states
  if (isLoading) return <Typography>Loading rescuers...</Typography>;
  if (error) return <Typography>Error fetching rescuers data.</Typography>;

  // Use rescuers data to render units
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
          Active Rescue Units
        </Typography>
        <HealthAndSafetyIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />
      </FlexBetween>

      {/* Icons with Labels in 4 Columns */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        gap="1rem"
        mt="1rem"
        alignItems="center"
      >
        {rescuers.map((rescuer, index) => {
          const color = getStatusColor(rescuer.status);
          return (
            <Box key={index} display="flex" flexDirection="column" alignItems="center">
              <AirportShuttleIcon sx={{ fontSize: "30px", color }} />
              <Typography variant="body2" sx={{ color, mt: "0.5rem" }}>
                {rescuer.firstName} 
              </Typography>
              <Typography variant="caption" sx={{ color, mt: "0.25rem" }}>
                {rescuer.status}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveRescuers;
