import React, { useState } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFetchReportsQuery, useUpdateReportMutation, useDeleteReportMutation } from "state/reportApi"; 
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogReportForm from "components/DialogReportForm"; // Import your dialog component

const Reports = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog open/close
  const [currentReport, setCurrentReport] = useState(null); // State to hold the selected report

  // Fetching reports using the query hook
  const { data, isLoading, refetch } = useFetchReportsQuery(); 
  const [updateReport] = useUpdateReportMutation(); 
  const [deleteReport] = useDeleteReportMutation(); 

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "disasterCategory", headerName: "Disaster Category", flex: 1 },
    {
      field: "disasterImages",
      headerName: "Images",
      flex: 1,
      renderCell: (params) =>
        params.value[0] !== "No Images" ? (
          <img src={params.value[0]} alt="Disaster" width="100" />
        ) : (
          <span>No Images</span>
        ),
    },
    { field: "disasterInfo", headerName: "Description", flex: 1 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 0.5,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "rescuerId", headerName: "Rescued By", flex: 1 }, 
    { field: "reportedBy", headerName: "Reported By", flex: 1 },
    { field: "disasterStatus", headerName: "Status", flex: 0.7 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      renderCell: (params) => (
        <Box>
          <IconButton
            sx={{ color: theme.palette.success.main }} 
            onClick={() => handleEditReport(params.row)} // Updated function name to handleEditReport
          >
            <EditIcon />
          </IconButton>
          <IconButton
            sx={{ color: theme.palette.error.main }} 
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    }
  ];

  // Function to handle editing the selected report
  const handleEditReport = (report) => {
    setCurrentReport(report); // Set the selected report data to currentReport state
    setOpenDialog(true); // Open the dialog
  };

  // Function to handle report deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(id).unwrap();
        refetch(); 
      } catch (error) {
        console.error("Failed to delete the report: ", error);
        alert("Failed to delete the report. Please try again.");
      }
    }
  };

  // Function to close the dialog and clear selected report data
  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    setCurrentReport(null); // Clear the current report
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Reports" subtitle="Entire list of reports" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data) || []}
          columns={columns}
          rowCount={(data && data.length) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>

      {/* Dialog for Editing Report */}
      <DialogReportForm 
        open={openDialog} 
        onClose={handleCloseDialog} 
        reportData={currentReport} // Pass the selected report data to DialogReportForm
      />
    </Box>
  );
};

export default Reports;
