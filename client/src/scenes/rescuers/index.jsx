import React, { useState } from 'react';
import { Box, Button, IconButton, Avatar, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Header from 'components/Header';
import DialogRescuerForm from 'components/DialogRescuerForm'; // Import the new component
import { useGetRescuersQuery } from 'state/api'; // Assume this is your API hook to fetch rescuers

const Rescuers = () => {
  const theme = useTheme();
  const { data: rescuers, isLoading, refetch } = useGetRescuersQuery();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRescuer, setCurrentRescuer] = useState(null);

  const handleAddRescuer = () => {
    setEditMode(false);
    setCurrentRescuer(null);
    setOpen(true);
  };

  const handleEditRescuer = (rescuer) => {
    setEditMode(true);
    setCurrentRescuer(rescuer);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDeleteRescuer = async (id) => {
    if (window.confirm("Are you sure you want to delete this rescuer?")) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/client/rescuers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          refetch();
        } else {
          console.error("Failed to delete rescuer");
        }
      } catch (error) {
        console.error("Error deleting rescuer:", error);
      }
    }
  };

  const handleSubmitForm = async (formData) => {
    if (editMode) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/client/rescuers/${currentRescuer._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          refetch();
          handleCloseDialog();
        } else {
          console.error("Failed to update rescuer");
        }
      } catch (error) {
        console.error("Error updating rescuer:", error);
      }
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/client/rescuers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          refetch();
          handleCloseDialog();
        } else {
          console.error("Failed to add rescuer");
        }
      } catch (error) {
        console.error("Error adding rescuer:", error);
      }
    }
  };

  const columns = [
    { 
      field: 'profileImage', 
      headerName: 'Image', 
      flex: 0.5,
      renderCell: (params) => (
        <Avatar src={params.row.profileImage} alt={params.row.firstName} />
      ),
    },
    { field: 'firstName', headerName: 'First Name', flex: 0.5 },
    { field: 'lastName', headerName: 'Last Name', flex: 0.5 },
    { field: 'email', headerName: 'Email', flex: 0.5 },
    { field: 'mobileNumber', headerName: 'Mobile Number', flex: 0.5 },
    { field: 'address', headerName: 'Address', flex: 0.8 }, 
    {
      field: "reportsTaken",
      headerName: "Reports Taken",
      flex: 0.3,
      renderCell: (params) => {
        return params.value.length > 0 ? params.value.length : 0;  // Check the length of the reports array
      },
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditRescuer(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteRescuer(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Rescuers" subtitle="List of Rescuers" />
      <Box display="flex" justifyContent="flex-end" mt="20px">
        <Button variant="contained" color="primary" onClick={handleAddRescuer}>
          Add Rescuer
        </Button>
      </Box>
      <Box mt="20px" height="75vh">
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <DataGrid
            loading={isLoading || !rescuers}
            getRowId={(row) => row._id}
            rows={rescuers || []}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-root": {
                border: "1px solid",
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
          />
        )}
      </Box>

      <DialogRescuerForm
        open={open}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitForm}
        editMode={editMode}
        initialData={currentRescuer}
      />
    </Box>
  );
};

export default Rescuers;
