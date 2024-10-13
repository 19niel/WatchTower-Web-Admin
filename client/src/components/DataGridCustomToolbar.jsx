import React, { useState } from "react";
import { Search } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment, Button } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";
import DialogReportForm from "./DialogReportForm"; // Import the DialogReportForm component

const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch }) => {
  const [openDialog, setOpenDialog] = useState(false); // State to manage the dialog open/close status

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = (formData) => {
    console.log("Submitted data:", formData);
    setOpenDialog(false); // Close the dialog after submission
  };

  return (
    <>
      <GridToolbarContainer>
        <FlexBetween width="100%">
          <FlexBetween>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
          </FlexBetween>

          {/* Search bar with Add Report button */}
          <FlexBetween>
            <TextField
              label="Search..."
              sx={{ mb: "0.5rem", width: "15rem" }}
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearch(searchInput);
                        setSearchInput("");
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Add Report Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog} // Open the dialog when clicked
              sx={{ ml: 2, mb: "0.5rem" }}
            >
              Add Report
            </Button>
          </FlexBetween>
        </FlexBetween>
      </GridToolbarContainer>

      {/* Render DialogReportForm when openDialog is true */}
      <DialogReportForm
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
        editMode={false} // Assuming this is for adding a new report
      />
    </>
  );
};

export default DataGridCustomToolbar;
