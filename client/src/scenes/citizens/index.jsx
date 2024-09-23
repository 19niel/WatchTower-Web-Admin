import React, { useState } from 'react';
import { Box, useTheme, Button, Dialog, DialogTitle, DialogContent, TextField, Grid, IconButton, Typography } from "@mui/material";
import { PhotoCamera, Close as CloseIcon } from '@mui/icons-material';
import { useGetCitizensQuery } from 'state/api'; 
import Header from "components/Header";
import { DataGrid } from '@mui/x-data-grid';

const Citizens = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCitizensQuery();

  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImagePreview('');
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setProfileImage('');
    setImagePreview('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('mobileNumber', mobileNumber);
    formData.append('address', address);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/citizens`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await response.json();
        handleClose();
      }
    } catch (error) {
      console.error('Error creating citizen:', error);
    }
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
        return params.value.replace(/^(\d{4})(\d{3})(\d{3})/, "$1-$2-$3");
      },
    },
    {
      field: "address",
      headerName: "Address",
      flex: 0.8,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Citizens" subtitle="List of Citizens" />
      
      <Box display="flex" justifyContent="flex-end" mt="20px">
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: theme.palette.primary.main }}
          onClick={handleClickOpen}
        >
          Add Citizen
        </Button>
      </Box>

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
                  sx={{ zIndex: 1 }} // Ensure the camera icon is above other elements
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
                margin="dense"
                InputProps={{ readOnly: true }}
                value="Pinned location description will appear here."
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
        <Box sx={{ padding: '8px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
        </Box>
      </Dialog>

      <Box
        mt="30px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
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
