import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const PriorityDialog = ({ open, onClose, onConfirm }) => {
  const [priority, setPriority] = useState("");

  const handleConfirm = () => {
    if (priority) {
      onConfirm(priority);
      onClose();
    } else {
      alert("Please select a priority level.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Priority Level</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Priority Level</InputLabel>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            label="Priority Level"
          >
            <MenuItem value="High Priority">High Priority</MenuItem>
            <MenuItem value="Medium Priority">Medium Priority</MenuItem>
            <MenuItem value="Low Priority">Low Priority</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriorityDialog;
