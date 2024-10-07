import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import SanJuanMap from "components/SanJuanMap";

const Geography = () => {
  const theme = useTheme();

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Map of Reports" subtitle="Find all the history of reports" />
      <Box
        mt="40px"
        height="75vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
      >
        
        <SanJuanMap />  
   

      </Box>
    </Box>
  );
};

export default Geography;
