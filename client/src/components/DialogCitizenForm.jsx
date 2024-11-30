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
import { geocodeLatLng } from '../utils/geocode';

const DialogCitizenForm = ({ open, onClose, onSubmit, editMode, initialData }) => {
  const theme = useTheme();

  // Initial state setup for the form fields
  const initialFormData = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    mobileNumber: '',
    address: '',
    profileImage: null,
  };

  // Form data state
  const [formData, setFormData] = useState(initialFormData);

  // Populate form if in edit mode
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
      setFormData(initialFormData); // Reset form for new entry
    }
  }, [editMode, initialData]);

  // Handle profile image changes
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

  // Clear profile image
  const clearImage = () => {
    setFormData((prevData) => ({ ...prevData, profileImage: null }));
  };

  // Handle location selection (e.g., from map)
  const handleLocationSelect = async ({ lat, lng }) => {
    // Set the address with coordinates first
    setFormData((prevData) => ({
      ...prevData,
      address: `Latitude: ${lat}, Longitude: ${lng}`, // Temporary address with coordinates
    }));

    // Use geocode function to get a human-readable address
    const locationDescription = await geocodeLatLng(lat, lng);
    setFormData((prevData) => ({
      ...prevData,
      address: locationDescription || `Latitude: ${lat}, Longitude: ${lng}`,
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    onSubmit(formData); // Call onSubmit with the form data
  };

  // Handle clear form data
  const handleClear = () => {
    setFormData(initialFormData); // Reset form data to initial state
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
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Last Name"
                    type="text"
                    fullWidth
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </Grid>
              </Grid>

              <TextField
                margin="dense"
                label="Username"
                type="text"
                fullWidth
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                <SanJuanMap onLocationSelect={handleLocationSelect} />
              </Box>

              <TextField
                label="Location Description"
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Mobile Number"
                type="text"
                fullWidth
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
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
            {/* Clear button */}
            <Button onClick={handleClear} color="secondary" variant="outlined" sx={{ ml: 1 }}>
              Clear
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCitizenForm;
