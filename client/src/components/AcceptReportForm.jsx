import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const AcceptReportForm = ({ open, onClose, onSubmit, report }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Ensure this key is defined in .env.local
  });

  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch coordinates from the location string
  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          },
        }
      );
      const location = response.data.results[0]?.geometry.location;
      return location ? { lat: location.lat, lng: location.lng } : null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadCoordinates = async () => {
      if (report?.coordinates) {
        setCoordinates(report.coordinates);
      } else if (report?.location) {
        const fetchedCoordinates = await fetchCoordinates(report.location);
        setCoordinates(fetchedCoordinates);
      }
      setLoading(false);
    };

    if (open) {
      setLoading(true);
      loadCoordinates();
    }
  }, [open, report]);

  const handleSubmit = async (e) => { // Add async here
    e.preventDefault();
  
    // Send the report ID to the backend to update the disasterStatus and priority
    try {
      const response = await axios.put(
        `http://localhost:5000/api/reports/${report._id}/activate`
      );
  
      // After successful update, close the dialog
      console.log("Report updated:", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating report:", error);
      // Handle error (e.g., show a notification)
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ p: 4, width: 600, textAlign: "center" }}>
          <Typography variant="h6">Loading Report...</Typography>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 4, width: 600 }}>
        <Typography variant="h6">Accept Report</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Disaster Category:</strong> {report.disasterCategory}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Disaster Info:</strong> {report.disasterInfo}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Location:</strong> {report.location}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {isLoaded && coordinates ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: coordinates.lat, lng: coordinates.lng }}
              zoom={15}
            >
              <Marker position={{ lat: coordinates.lat, lng: coordinates.lng }} />
            </GoogleMap>
          ) : (
            <Typography>Unable to load map. Please check the location details.</Typography>
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

