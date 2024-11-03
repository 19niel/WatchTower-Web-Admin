import React from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const AcceptReportForm = ({ open, onClose, onSubmit, report }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Make sure this key is defined
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(report._id);
    onClose();
  };

  // Extract latitude and longitude from the location string
  const locationMatch = report.location.match(/Latitude: ([\d.-]+), Longitude: ([\d.-]+)/);
  
  if (!locationMatch) {
    console.error("Invalid location format:", report.location);
    return null; // Exit if location format is invalid
  }

  const [latitude, longitude] = locationMatch.slice(1, 3).map(Number);

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 4, width: 600 }}>
        <Typography variant="h6">Accept Report</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Disaster Category: {report.disasterCategory}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Disaster Info: {report.disasterInfo}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Location: {report.location}
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: latitude, lng: longitude }}
              zoom={15}
            >
              <Marker position={{ lat: latitude, lng: longitude }} />
            </GoogleMap>
          ) : (
            <Typography>Loading Map...</Typography>
          )}
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Accept
          </Button>
          <Button onClick={onClose} variant="outlined" sx={{ ml: 1, mt: 2 }}>
            Cancel
          </Button>
        </form>
      </Box>
    </Dialog>
  );
};

export default AcceptReportForm;
