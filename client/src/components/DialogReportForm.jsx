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
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { Close as CloseIcon, PhotoCamera } from '@mui/icons-material';
import SanJuanMap from './SanJuanMap'; // Assuming you're using the SanJuanMap component for location selection

const DialogReportForm = ({ open, onClose, onSubmit, editMode, initialData }) => {
  const theme = useTheme();

  // State initialization
  const [reporterId, setReporterId] = useState('');
  const [location, setLocation] = useState('');
  const [disasterType, setDisasterType] = useState('');
  const [disasterImage, setDisasterImage] = useState(null);
  const [disasterInfo, setDisasterInfo] = useState('');
  const [disasterCategory, setDisasterCategory] = useState('Pending');
  const [rescuerId, setRescuerId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Populate form fields if in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setReporterId(initialData.reporterId || '');
      setLocation(initialData.location || '');
      setDisasterType(initialData.disasterType || '');
      setDisasterInfo(initialData.disasterInfo || '');
      setDisasterCategory(initialData.disasterCategory || 'Pending');
      setRescuerId(initialData.rescuerId || '');
      setIsVerified(initialData.isVerified || false);
      setImagePreview(initialData.disasterImage || null);
    } else {
      // Reset form fields for adding a new report
      setReporterId('');
      setLocation('');
      setDisasterType('');
      setDisasterInfo('');
      setDisasterCategory('Pending');
      setRescuerId('');
      setIsVerified(false);
      setImagePreview(null);
    }
  }, [editMode, initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setDisasterImage(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setDisasterImage(null);
  };

  const handleLocationSelect = ({ lat, lng }) => {
    setLocation(`Latitude: ${lat}, Longitude: ${lng}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    const formData = {
      reporterId,
      location,
      disasterType,
      disasterImage: imagePreview, // Send image preview URL or file
      disasterInfo,
      disasterCategory,
      rescuerId,
      isVerified,
    };
    onSubmit(formData); // Call the onSubmit prop to notify parent
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editMode ? 'Edit Report' : 'Add New Report'}
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
              <TextField
                margin="dense"
                label="Reporter ID"
                type="text"
                fullWidth
                value={reporterId}
                onChange={(e) => setReporterId(e.target.value)}
                required
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Disaster Category</InputLabel>
                <Select
                  value={disasterCategory}
                  onChange={(e) => setDisasterCategory(e.target.value)}
                  required
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Solved">Solved</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                label="Disaster Type"
                type="text"
                fullWidth
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value)}
                required
              />

              <TextField
                margin="dense"
                label="Disaster Info"
                type="text"
                fullWidth
                value={disasterInfo}
                onChange={(e) => setDisasterInfo(e.target.value)}
                required
                multiline
                minRows={3}
              />

              <Typography variant="body1" mb={1}>
                Upload Disaster Image
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1" mb={1}>
                Select Location
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <TextField
                margin="dense"
                label="Rescuer ID (optional)"
                type="text"
                fullWidth
                value={rescuerId}
                onChange={(e) => setRescuerId(e.target.value)}
              />

              <FormControl fullWidth margin="dense">
                <InputLabel>Verified</InputLabel>
                <Select
                  value={isVerified}
                  onChange={(e) => setIsVerified(e.target.value)}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button onClick={onClose} color="inherit" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained" sx={{ ml: 1 }}>
              {editMode ? 'Update Report' : 'Add Report'}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogReportForm;
