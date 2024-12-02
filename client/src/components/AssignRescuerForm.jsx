import React, { useState, useEffect } from "react";
import { Box, Button, MenuItem, TextField, Typography, DialogActions } from "@mui/material";
import axios from "axios";

const AssignRescuerForm = ({ onClose, report }) => {
  const [selectedRescuer, setSelectedRescuer] = useState("");
  const [rescuers, setRescuers] = useState([]);

  // Fetch the rescuers data from the backend
  useEffect(() => {
    const fetchRescuers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/client/rescuers`); // Adjust the URL to match your backend endpoint
        setRescuers(response.data); // Assuming response is an array of rescuers
      } catch (error) {
        console.error("Error fetching rescuers:", error);
      }
    };

    fetchRescuers();
  }, []);

  const handleRescuerChange = (event) => {
    setSelectedRescuer(event.target.value);
  };

  const handleAssign = async () => {
    try {
      const rescuer = rescuers.find((rescuer) => rescuer._id === selectedRescuer);
      if (rescuer) {
        const updatedReport = {
          rescuerId: rescuer._id,
          rescuedBy: `${rescuer.firstName} ${rescuer.lastName}`,
          priority: "pending", // Make sure this is set
        };
  
        console.log("Updated Report:", updatedReport); // Log the report data to verify it
  
        // Send the updated report data to the backend using the correct endpoint
        await axios.put(`${process.env.REACT_APP_BASE_URL}/reports/${report._id}/accept`, updatedReport);
  
        console.log("Assigned Rescuer:", rescuer.firstName, rescuer.lastName);
      }
      onClose(); // Close the form after assigning
    } catch (error) {
      console.error("Error assigning rescuer:", error);
    }
  };
  
  

  return (
    <Box padding="20px">
      <Typography variant="h6">Assign Rescuer</Typography>
      <Typography variant="body2" color="textSecondary" marginBottom="16px">
        Assign a rescuer to report: {report?.disasterCategory}
      </Typography>

      <TextField
        select
        label="Select Rescuer"
        value={selectedRescuer}
        onChange={handleRescuerChange}
        fullWidth
        variant="outlined"
        margin="normal"
      >
        {rescuers.map((rescuer) => (
          <MenuItem key={rescuer._id} value={rescuer._id}>
            {rescuer.firstName} {rescuer.lastName}
          </MenuItem>
        ))}
      </TextField>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAssign} color="primary" variant="contained">
          Assign
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AssignRescuerForm;
