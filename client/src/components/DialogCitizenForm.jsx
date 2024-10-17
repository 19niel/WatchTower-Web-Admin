import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import { Close as CloseIcon, PhotoCamera } from '@mui/icons-material';
import SanJuanMap from '../components/SanJuanMap';

const DialogCitizenForm = ({ open, onClose, onSubmit, editMode, initialData }) => {
  const theme = useTheme();

  // State initialization
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    mobileNumber: '',
    address: '',
    profileImage: null,
  });

  // Populate form fields if in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        username: initialData.username || '',
        email: initialData.email || '',
        mobileNumber: initialData.mobileNumber || '',
        address: initialData.address || '',
        profileImage: initialData.profileImage || null,
      });
    } else {
      // Reset form fields for adding a new citizen
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: '',
        mobileNumber: '',
        address: '',
        profileImage: null,
      });
    }
  }, [editMode, initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setFormData((prevData) => ({ ...prevData, profileImage: null }));
  };

  const handleLocationSelect = ({ lat, lng }) => {
    setFormData((prevData) => ({
      ...prevData,
      address: `Latitude: ${lat}, Longitude: ${lng}`, // Set the address state with the coordinates
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    onSubmit(formData); // Call the onSubmit prop to notify parent
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editMode ? 'Edit Citizen' : 'Add New Citizen'}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 12, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '16px' }}>
        <form onSubmit={handleSubmit}>
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
                {formData.profileImage && (
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
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
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
                    value={formData.firstName}
                    onChange={(e) => setFormData((prevData) => ({ ...prevData, firstName: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Last Name"
                    type="text"
                    fullWidth
                    value={formData.lastName}
                    onChange={(e) => setFormData((prevData) => ({ ...prevData, lastName: e.target.value }))}
                  />
                </Grid>
              </Grid>

              <TextField
                margin="dense"
                label="Username"
                type="text"
                fullWidth
                value={formData.username}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, username: e.target.value }))}
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, password: e.target.value }))}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, email: e.target.value }))}
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
                <SanJuanMap onLocationSelect={handleLocationSelect} /> {/* Pass the function to SanJuanMap */}
              </Box>

              <TextField
                label="Location Description"
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, address: e.target.value }))}
              />
              <TextField
                margin="dense"
                label="Mobile Number"
                type="text"
                fullWidth
                value={formData.mobileNumber}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, mobileNumber: e.target.value }))}
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button onClick={onClose} color="inherit" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained" sx={{ ml: 1 }}>
              {editMode ? 'Update' : 'Add'}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCitizenForm;
