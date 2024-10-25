// client/src/scenes/pendingreports/index.jsx

import React, { useState } from "react";
import { Box, useTheme, Grid } from "@mui/material";
import Header from "components/Header";
import PendingReportCard from "../../components/PendingReportCard";
import PriorityDialog from "../../components/PriorityDialog";
import {
  useGetPendingReportsQuery,
  useActivateReportMutation,
  useDeleteReportMutation,
} from "../../state/pendingApi";

const PendingReports = () => {
  const theme = useTheme();
  const { data: pendingReports = [], error, isLoading } = useGetPendingReportsQuery();
  const [activateReport] = useActivateReportMutation();
  const [deleteReport] = useDeleteReportMutation();

  // State to manage dialog visibility and selected report
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleOpenDialog = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  const handleConfirmPriority = async (priority) => {
    try {
      await activateReport({ id: selectedReport._id, priority }).unwrap();
      alert('Report activated with priority: ' + priority);
    } catch (error) {
      console.error('Error activating report:', error);
    }
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    try {
      await deleteReport(id).unwrap();
      alert('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching reports</div>;

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Pending Reports" subtitle="Verify All the Reports Here" />
      <Box
        mt="40px"
        height="75vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid container spacing={2} p={2} overflow="auto">
          {pendingReports.map((report) => (
            <Grid item key={report._id}>
              <PendingReportCard
                report={report}
                onActivate={() => handleOpenDialog(report)}
                onDelete={() => handleDelete(report._id)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Priority Dialog */}
      <PriorityDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmPriority}
      />
    </Box>
  );
};

export default PendingReports;
