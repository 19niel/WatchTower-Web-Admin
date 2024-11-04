import React from "react";
import { Box, Button, MenuItem, TextField, Typography, DialogActions } from "@mui/material";

const AssignRescuerForm = ({ onClose, report }) => {
  const [selectedRescuer, setSelectedRescuer] = React.useState("");

  const handleRescuerChange = (event) => {
    setSelectedRescuer(event.target.value);
  };

  const handleAssign = () => {
    // Placeholder function for assigning a rescuer
    console.log("Assigned Rescuer:", selectedRescuer, "to Report:", report._id);
    onClose();
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
        <MenuItem value="Rescuer 1">Rescuer 1</MenuItem>
        <MenuItem value="Rescuer 2">Rescuer 2</MenuItem>
        <MenuItem value="Rescuer 3">Rescuer 3</MenuItem>
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
