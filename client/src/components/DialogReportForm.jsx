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
import SanJuanMap from './SanJuanMap';
import { useCreateReportMutation } from '../state/reportApi';

const DialogReportForm = ({ open, onClose, onSubmit, editMode, initialData }) => {
  const theme = useTheme();

  const [reporterId] = useState('66cc2f274aec4c32e965d452');
  const [reportedBy, setReportedBy] = useState('');
  const [location, setLocation] = useState('');
  const [disasterInfo, setDisasterInfo] = useState('');
  const [disasterCategory, setDisasterCategory] = useState('');
  const [priority, setPriority] = useState('Pending');
  const [images, setImages] = useState([]); // Array of { file, previewUrl }
  const [createReport, { isLoading }] = useCreateReportMutation();

  useEffect(() => {
    if (editMode && initialData) {
      setLocation(initialData.location || '');
      setDisasterInfo(initialData.disasterInfo || '');
      setDisasterCategory(initialData.disasterCategory || '');
      setReportedBy(initialData.reportedBy || '');
      setPriority(initialData.priority || 'Pending');
      setImages(initialData.disasterImages?.map(url => ({ previewUrl: url })) || []);
    } else {
      resetFormFields();
    }
  }, [editMode, initialData]);

  const resetFormFields = () => {
    setLocation('');
    setDisasterInfo('');
    setDisasterCategory('');
    setReportedBy('');
    setPriority('Pending');
    setImages([]);
  };

  const handleLocationSelect = ({ lat, lng }) => {
    setLocation(`Latitude: ${lat}, Longitude: ${lng}`);
  };

  const handleImages = (event) => {
    const files = Array.from(event.target.files);

    // Create an array of files with preview URLs
    const newImages = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(updatedImages[index].previewUrl);
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("reporterId", reporterId);
    formData.append("reportedBy", reportedBy);
    formData.append("location", location);
    formData.append("disasterInfo", disasterInfo);
    formData.append("disasterCategory", disasterCategory);
    formData.append("disasterStatus", "active");
    formData.append("rescuerId", "No Rescuer Yet");
    formData.append("rescuedBy", "No Rescuer Yet");
    formData.append("priority", priority);

    images.forEach((imageObj) => {
      if (imageObj.file) {
        formData.append("disasterImages", imageObj.file);
      }
    });

    try {
      await createReport(formData).unwrap();
      resetFormFields();
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Failed to create report:', error);
    }
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
                {images.length > 0 ? (
                  images.map((imgObj, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={imgObj.previewUrl}
                        alt={`disaster-image-${index}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      <IconButton
                        onClick={() => removeImage(index)}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          borderRadius: '50%',
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Typography>No Images</Typography>
                )}
                <IconButton
                  color="primary"
                  aria-label="upload pictures"
                  component="label"
                  sx={{ zIndex: 1 }}
                >
                  <input hidden accept="image/*" type="file" multiple onChange={handleImages} />
                  <PhotoCamera fontSize="large" />
                </IconButton>
              </Box>

              <TextField
                margin="dense"
                label="Reported by"
                type="text"
                fullWidth
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
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

          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button onClick={onClose} color="inherit" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained" sx={{ marginLeft: 2 }} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogReportForm;