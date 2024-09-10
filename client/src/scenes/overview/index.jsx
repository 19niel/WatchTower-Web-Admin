import React, { useState } from "react";
import { FormControl, MenuItem, InputLabel, Box, Select } from "@mui/material";
import Header from "components/Header";
import OverviewChart from "components/OverviewChart";

const Overview = () => {
  // Set initial state to match one of the menu items
  const [view, setView] = useState("totalReports"); // Initially show 'All Reports'

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="OVERVIEW"
        subtitle="Overview of general reports"
      />
      <Box height="75vh">
        {/* Dropdown for selecting view */}
        <FormControl sx={{ mt: "1rem" }}>
          <InputLabel>View</InputLabel>
          <Select
            value={view}
            label="View"
            onChange={(e) => setView(e.target.value)} // Update state when selection changes
          >
            {/* Options for total reports and solved reports */}
            <MenuItem value="totalReports">All Reports</MenuItem>
            <MenuItem value="totalReportsSolved">Solved Reports</MenuItem>
          </Select>
        </FormControl>

        {/* Pass the selected view to OverviewChart */}
        <OverviewChart view={view} />
      </Box>
    </Box>
  );
};

export default Overview;
