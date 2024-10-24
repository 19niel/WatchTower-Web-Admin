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
import { Close as CloseIcon, PhotoCamera, Cancel as CancelIcon } from '@mui/icons-material';
import SanJuanMap from './SanJuanMap'; // Assuming you're using the SanJuanMap component for location selection
import { useCreateReportMutation } from '../state/reportApi'; // Import the mutation

const DialogReportForm = ({ open, onClose, onSubmit, editMode, initialData }) => {
  const theme = useTheme();

  // State initialization
  const [reporterId] = useState('66cc2f274aec4c32e965d452'); // Static admin ID
  const [reportedBy, setReporterBy] = useState('');
  const [location, setLocation] = useState('');
  const [disasterInfo, setDisasterInfo] = useState('');
  const [disasterCategory, setDisasterCategory] = useState('Others');
  const [priority, setPriority] = useState('Pending'); // State for Priority
  const [createReport, { isLoading, isError, error }] = useCreateReportMutation(); // Call the mutation
  const [selectedImages, setSelectedImages] = useState([]); // State for selected images
  const [imagePreviews, setImagePreviews] = useState([]); // State for image previews

  // Populate form fields if in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setLocation(initialData.location || '');
      setDisasterInfo(initialData.disasterInfo || '');
      setDisasterCategory(initialData.disasterCategory || 'Others');
      setPriority(initialData.priority || 'Pending'); // Set the priority if in edit mode
    } else {
      // Reset form fields for adding a new report
      setLocation('');
      setDisasterInfo('');
      setDisasterCategory('Others');
      setPriority('Pending'); // Default value for Priority
    }
  }, [editMode, initialData]);

  const handleLocationSelect = ({ lat, lng }) => {
    setLocation(`Latitude: ${lat}, Longitude: ${lng}`);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages([...selectedImages, ...files]);

    // Create image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append('reporterId', reporterId);
    formData.append('reportedBy', reportedBy);
    formData.append('location', location);
    formData.append('disasterInfo', disasterInfo);
    formData.append('disasterCategory', disasterCategory);
    formData.append('priority', priority); // Append priority
    formData.append('disasterStatus', 'active');
    formData.append('rescuerId', "No Rescuer Yet");
    formData.append('rescuerName', "No Rescuer Yet");

    // Append all selected images
    selectedImages.forEach((image) => {
      formData.append('disasterImages', image);
    });

    // Call the createReport mutation with the FormData
    await createReport(formData).unwrap(); // Using unwrap to catch errors
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
              <Typography variant="body1" mb={1}>
                Upload Disaster Images
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                border={`2px dashed ${theme.palette.grey[400]}`}
                borderRadius="8px"
                position="relative"
                p={2}
                mb={2}
                minHeight="250px"
                width="100%"
                flexWrap="wrap"
                gap={2}
              >
                {imagePreviews.length > 0 ? (
                  imagePreviews.map((preview, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={preview}
                        alt={`preview-${index}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          color: 'white',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Typography>Upload Image</Typography>
                )}
                <IconButton
                  color="primary"
                  aria-label="upload pictures"
                  component="label"
                  sx={{ zIndex: 1 }}
                >
                  <input hidden accept="image/*" type="file" multiple onChange={handleImageChange} />
                  <PhotoCamera fontSize="large" />
                </IconButton>
              </Box>

              <TextField
                margin="dense"
                label="Reported by"
                type="text"
                fullWidth
                value={reportedBy}
                onChange={(e) => setReporterBy(e.target.value)}
                required
              />

              <FormControl fullWidth margin="dense">
                <InputLabel>Disaster Category</InputLabel>
                <Select
                  value={disasterCategory}
                  onChange={(e) => setDisasterCategory(e.target.value)}
                  required
                >
                  <MenuItem value="Flood">Flood</MenuItem>
                  <MenuItem value="Typhoon">Typhoon</MenuItem>
                  <MenuItem value="Fire">Fire</MenuItem>
                  <MenuItem value="Animals">Animals</MenuItem>
                  <MenuItem value="Casualties">Casualties</MenuItem>
                  <MenuItem value="Structural_Damage">Structural Damage</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>

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
                <SanJuanMap onLocationSelect={handleLocationSelect} />
              </Box>

              <TextField
                label="Location Description"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <FormControl fullWidth margin="dense">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <MenuItem value="High Priority">High Priority</MenuItem>
                  <MenuItem value="Medium Priority">Medium Priority</MenuItem>
                  <MenuItem value="Low Priority">Low Priority</MenuItem>
                  <MenuItem value="Lowest Priority">Lowest Priority</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={onClose} sx={{ marginRight: 2 }} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {editMode ? 'Save Changes' : 'Add Report'}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogReportForm;
