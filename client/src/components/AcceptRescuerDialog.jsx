import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";

const AcceptRescuerDialog = ({ open, onClose, report }) => {
  const [rescuer, setRescuer] = useState("");

  const handleSubmit = async () => {
    if (!report) return;

    const response = await fetch(`http://localhost:5001/reports/${report._id}/accept`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rescuer, status: "on progress" }),
    });

    if (response.ok) {
      // Handle successful submission, e.g., refresh reports
      onClose();
    } else {
      console.error("Error accepting report:", response.statusText);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Accept Rescuer</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Select Rescuer"
          value={rescuer}
          onChange={(e) => setRescuer(e.target.value)}
          fullWidth
        >
          {/* Replace with your actual rescuer options */}
          <MenuItem value="Rescuer 1">Rescuer 1</MenuItem>
          <MenuItem value="Rescuer 2">Rescuer 2</MenuItem>
          <MenuItem value="Rescuer 3">Rescuer 3</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcceptRescuerDialog;
