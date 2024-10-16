import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";

const LiveReports = () => {
  const theme = useTheme();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Pending Reports" subtitle="Verify All the Reports Here" />
      <Box
        mt="40px"
        height="75vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
      >     
       
   
      </Box>
    </Box>
  );
};

export default LiveReports ;
