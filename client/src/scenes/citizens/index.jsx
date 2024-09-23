import React, { useState } from 'react';
import { Box, useTheme, Button, Dialog, DialogTitle, DialogContent, TextField, Grid, IconButton, Typography } from "@mui/material";
import { PhotoCamera } from '@mui/icons-material';
import { useGetCitizensQuery } from 'state/api'; 
import Header from "components/Header";
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

const Citizens = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCitizensQuery();

  // State to manage dialog visibility
  const [open, setOpen] = useState(false);

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: "profileImage",
      headerName: "Image",
      flex: 0.5,
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 0.5,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 0.5,
    },
    {
      field: "mobileNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(/^(\d{4})(\d{3})(\d{3})/, "$1-$2-$3"); // Format the number with REGEX
      },
    },
    {
      field: "address",
      headerName: "Address",
      flex: 0.8,
      renderCell: (params) => {
        const address = params.value || {}; // the `address` object
        const { houseNumber = "", street = "", barangay = "" } = address;
        return `${houseNumber}, ${street}, ${barangay}`;
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      {/* Header */}
      <Header title="Citizens" subtitle="List of Citizens" />
      
      {/* Add Citizen Button */}
      <Box display="flex" justifyContent="flex-end" mt="20px">
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: theme.palette.primary.main }}
          onClick={handleClickOpen} // Opens the dialog on click
        >
          Add Citizen
        </Button>
      </Box>

      {/* Dialog for Adding Citizen */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Add New Citizen
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: 'absolute', right: 12, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '16px' }}>
          <Grid container spacing={2}>
            {/* First Column */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" mb={1}>
                Profile Image
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="150px"
                border={`2px dashed ${theme.palette.grey[400]}`}
                borderRadius="8px"
                mb={2}
              >
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCamera fontSize="large" />
                </IconButton>
              </Box>
              <TextField margin="dense" label="First Name" type="text" fullWidth />
              <TextField margin="dense" label="Last Name" type="text" fullWidth />
              <TextField margin="dense" label="Mobile Number" type="text" fullWidth />
            </Grid>

            {/* Second Column */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" mb={1}>
                Address
              </Typography>
              <Box
                height="200px"
                border={`1px solid ${theme.palette.grey[400]}`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={2}
              >
                Google Maps Placeholder
              </Box>
              <TextField
                label="Location Description"
                fullWidth
                margin="dense"
                InputProps={{ readOnly: true }}
                value="Pinned location description will appear here."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Box sx={{ padding: '8px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} color="primary">Submit</Button>
        </Box>
      </Dialog>

      {/* DataGrid Table */}
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
}

export default Citizens;
