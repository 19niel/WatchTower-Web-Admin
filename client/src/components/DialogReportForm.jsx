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
import { useCreateReportMutation } from '../state/reportApi'; // Import the mutation

const DialogReportForm = ({ open, onClose, onSubmit, editMode, initialData }) => {
  const theme = useTheme();

  // State initialization
  const [reporterId] = useState('66cc2f274aec4c32e965d452'); // Static admin ID
  const [reportedBy, setReporterBy] = useState('');
  const [location, setLocation] = useState('');
  const [disasterImages, setDisasterImages] = useState([]); // Array to hold multiple images
  const [disasterInfo, setDisasterInfo] = useState('');
  const [disasterCategory, setDisasterCategory] = useState('Pending');
  const [imagePreviews, setImagePreviews] = useState([]); // Previews for multiple images
  const [createReport, { isLoading, isError, error }] = useCreateReportMutation(); // Call the mutation

  // Populate form fields if in edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setLocation(initialData.location || '');
      setDisasterInfo(initialData.disasterInfo || '');
      setDisasterCategory(initialData.disasterCategory || 'Pending');
      setImagePreviews(initialData.disasterImages || []); // Load initial images if in edit mode
    } else {
      // Reset form fields for adding a new report
      setLocation('');
      setDisasterInfo('');
      setDisasterCategory('Pending');
      setImagePreviews([]);
    }
  }, [editMode, initialData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedImages = [...disasterImages, ...files];

    // Generate image previews
    const updatedPreviews = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result); // Resolve with base64 result
        };
      });
    });

    Promise.all(updatedPreviews).then((previews) => {
      setImagePreviews([...imagePreviews, ...previews]);
    });

    setDisasterImages(updatedImages);
  };

  const clearImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedImages = disasterImages.filter((_, i) => i !== index);

    setImagePreviews(updatedPreviews);
    setDisasterImages(updatedImages);
  };

  const handleLocationSelect = ({ lat, lng }) => {
    setLocation(`Latitude: ${lat}, Longitude: ${lng}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const imageLogs = disasterImages.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result); // Resolve with base64 result
        };
      });
    });

    const imageData = await Promise.all(imageLogs);

    const formData = {
      reporterId,
      reportedBy,
      location,
      disasterImages: imageData, // Send the array of base64 images
      disasterInfo,
      disasterCategory,
      disasterStatus: 'active',
      rescuerId: "No Rescuer Yet",
      rescuedBy: "No Rescuer Yet"
    };

    // Call the createReport mutation
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
                justifyContent={imagePreviews.length === 0 ? 'center' : 'flex-start'}
                border={`2px dashed ${theme.palette.grey[400]}`}
                borderRadius="8px"
                position="relative"
                p={2}
                mb={2}
                minHeight="250px"
                width="100%"
                flexWrap="wrap"
                gap={2}
                sx={{ overflowY: 'auto' }}
              >
                {imagePreviews.map((preview, index) => (
                  <Box key={index} position="relative" m={1}>
                    <IconButton
                      color="inherit"
                      onClick={() => clearImage(index)}
                      sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                ))}
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
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button onClick={onClose} color="inherit" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained" sx={{ marginLeft: 2 }} disabled={isLoading}>
              {editMode ? 'Update Report' : 'Add Report'}
            </Button>
          </Box>
          {isError && <Typography color="error">Error: {error.message}</Typography>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogReportForm;
