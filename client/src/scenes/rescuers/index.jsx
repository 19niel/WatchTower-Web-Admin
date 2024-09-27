import React, { useState } from 'react';
import { Box, useTheme, Button, Dialog, DialogTitle, DialogContent, TextField, Grid, IconButton, Typography } from "@mui/material";
import { PhotoCamera, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useGetRescuersQuery } from 'state/api'; 
import Header from "components/Header";
import { DataGrid } from '@mui/x-data-grid';

const Rescuers = () => {
    const theme = useTheme();
    const { data, isLoading, error, refetch } = useGetRescuersQuery();

    // Dialog state management
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentRescuerId, setCurrentRescuerId] = useState(null);

    // Form fields state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    // Handle dialog open and close
    const handleClickOpen = () => {
        setEditMode(false);
        setOpen(true);
        resetForm();
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setMobileNumber('');
        setAddress('');
        setProfileImage('');
        setImagePreview('');
        setCurrentRescuerId(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                // Convert file to Base64 if needed
                const base64String = reader.result;
                setProfileImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setProfileImage('');
        setImagePreview('');
    };

    const handleEdit = (row) => {
        setEditMode(true);
        setCurrentRescuerId(row._id);
        setFirstName(row.firstName);
        setLastName(row.lastName);
        setMobileNumber(row.mobileNumber);
        setAddress(row.address);
        setImagePreview(row.profileImage);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this citizen?")) {
          try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/client/citizens/${id}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              refetch(); // Refresh the citizen list
            } else {
              console.error("Failed to delete citizen");
            }
          } catch (error) {
            console.error("Error deleting citizen:", error);
          }
        }
      };
      
    const handleUpdate = async (event) => {
        event.preventDefault();

        const updatedData = {
            firstName,
            lastName,
            mobileNumber,
            address,
            profileImage: profileImage || imagePreview,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/client/rescuers/${currentRescuerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                refetch();
                handleClose();
            } else {
                console.error("Failed to update rescuer");
            }
        } catch (error) {
            console.error("Error updating rescuer:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
  
        if (editMode) {
            await handleUpdate(event);
        } else {
            const formData = {
                firstName,
                lastName,
                username,
                password,
                email,
                mobileNumber,
                address,
                profileImage, // Send Base64 string directly
            };
  
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/client/rescuers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
  
                if (response.ok) {
                    refetch();
                    handleClose();
                } else {
                    console.error("Failed to add rescuer");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    const columns = [

        {
            field: "profileImage",
            headerName: "Image",
            flex: 0.5,
            renderCell: (params) => (
                params.value ? (
                    <img src={params.value} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                ) : (
                    <Typography>No Image</Typography>
                )
            ),
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
            renderCell: (params) => params.value.replace(/^(\d{4})(\d{3})(\d{3})/, "$1-$2-$3"),
        },
        {
            field: "address",
            headerName: "Address",
            flex: 0.8,
        },
        {
            field: "reportsTaken",
            headerName: "Reports Taken",
            flex: 0.3,
            renderCell: (params) => {
              return params.value.length > 0 ? params.value.length : 0;  // Check the length of the reports array
            },
          },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.5,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDelete(params.row._id)} // Implement handleDelete function
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    if (error) return <div>Error: {error.message}</div>; // Handle error state

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="Rescuers" subtitle="List of Rescuers" />

            <Box display="flex" justifyContent="flex-end" mt="20px">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Add Rescuer
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editMode ? 'Edit Rescuer' : 'Add New Rescuer'}
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
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" mb={1}>
                Profile Image
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="250px"
                border={`2px dashed ${theme.palette.grey[400]}`}
                borderRadius="8px"
                position="relative"
                mb={2}
              >
                {imagePreview && (
                  <IconButton
                    color="inherit"
                    onClick={clearImage}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  sx={{ zIndex: 1 }}
                >
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                  <PhotoCamera fontSize="large" />
                </IconButton>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ) : (
                  <Typography variant="body2" color={theme.palette.grey[600]}>
                    Upload a photo
                  </Typography>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="First Name"
                    type="text"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Last Name"
                    type="text"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
              </Grid>
              <TextField
                margin="dense"
                label="Username"
                type="text"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1" mb={1}>
                Address
              </Typography>
              <Box
                border={`1px solid ${theme.palette.grey[400]}`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="250px"
                mb={2}
              >
                Google Maps Placeholder
              </Box>
              <TextField
                label="Location Description"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Mobile Number"
                type="text"
                fullWidth
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
                <Box display="flex" justifyContent="flex-end" p={2}>
                    <Button onClick={handleClose} color="inherit" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ ml: 1 }}>
                        {editMode ? 'Update' : 'Add'}
                    </Button>
                </Box>
            </Dialog>

            <Box mt="20px" height="75vh">
            <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}

          sx={{
            "& .MuiDataGrid-root": {
              border: "1px",
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
            </Box>
        </Box>
    );
}

export default Rescuers;
