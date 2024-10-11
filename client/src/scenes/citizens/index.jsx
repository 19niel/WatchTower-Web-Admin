import React, { useState } from 'react';
import { Box, Button, IconButton, Avatar, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Header from 'components/Header';
import DialogCitizenForm from 'components/DialogCitizenForm'; // Import the new component
import { useGetCitizensQuery } from 'state/api'; // Assume this is your API hook to fetch citizens

const Citizens = () => {
  const theme = useTheme();
  const { data: citizens, isLoading, refetch } = useGetCitizensQuery();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCitizen, setCurrentCitizen] = useState(null);

  const handleAddCitizen = () => {
    setEditMode(false);
    setCurrentCitizen(null);
    setOpen(true);
  };

  const handleEditCitizen = (citizen) => {
    setEditMode(true);
    setCurrentCitizen(citizen);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDeleteCitizen = async (id) => {
    if (window.confirm("Are you sure you want to delete this citizen?")) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/client/citizens/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          refetch();
        } else {
          console.error("Failed to delete citizen");
        }
      } catch (error) {
        console.error("Error deleting citizen:", error);
      }
    }
  };

  const handleSubmitForm = async (formData) => {
    if (editMode) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/client/citizens/${currentCitizen._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          refetch();
          handleCloseDialog();
        } else {
          console.error("Failed to update citizen");
        }
      } catch (error) {
        console.error("Error updating citizen:", error);
      }
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/client/citizens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          refetch();
          handleCloseDialog();
        } else {
          console.error("Failed to add citizen");
        }
      } catch (error) {
        console.error("Error adding citizen:", error);
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
    { field: "reports",headerName: "Reports Made",flex: 0.3,
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
          <IconButton onClick={() => handleEditCitizen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteCitizen(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Citizens" subtitle="List of Citizens" />
      <Box display="flex" justifyContent="flex-end" mt="20px">
        <Button variant="contained" color="primary" onClick={handleAddCitizen}>
          Add Citizen
        </Button>
      </Box>
      <Box mt="20px" height="75vh">
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <DataGrid
            loading={isLoading || !citizens}
            getRowId={(row) => row._id}
            rows={citizens || []}
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

      <DialogCitizenForm
        open={open}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitForm}
        editMode={editMode}
        initialData={currentCitizen}
      />
    </Box>
  );
};

export default Citizens;
