import React, { useState } from "react";
import { Box, Button, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFetchReportsQuery, useUpdateReportMutation, useDeleteReportMutation, useCreateReportMutation } from "state/reportApi"; 
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogReportForm from "components/DialogReportForm"; 
import ImagePreview from "components/ImagePreview"; 

const Reports = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false); 
  const [currentReport, setCurrentReport] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false); 
  const [previewImages, setPreviewImages] = useState([]); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 

  const { data, isLoading, refetch } = useFetchReportsQuery(); 
  const [updateReport] = useUpdateReportMutation(); 
  const [deleteReport] = useDeleteReportMutation();
  const [createReport] = useCreateReportMutation();

  const handleNextImage = () => {
    if (currentImageIndex < previewImages.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleOpenPreview = (images, index) => {
    setPreviewImages(images);
    setCurrentImageIndex(index);
    setPreviewOpen(true);
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "disasterCategory", headerName: "Disaster Category", flex: 1 },
    {
      field: "disasterImages",
      headerName: "Images",
      flex: 1,
      renderCell: (params) => {
        const images = params.value;
        if (!images.length || images[0] === "No Images") {
          return <span>No Images</span>;
        }
        return (
          <Box display="flex" justifyContent="space-between">
            {images.slice(0, 3).map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Disaster ${index + 1}`} 
                width="80" 
                style={{ marginRight: '4px', cursor: 'pointer' }} 
                onClick={() => handleOpenPreview(images, index)} 
              />
            ))}
          </Box>
        );
      },
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
            onClick={() => handleEditReport(params.row)} 
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

  const handleEditReport = (report) => {
    setCurrentReport(report);
    setOpenDialog(true);
  };

  const handleUpdateReport = async (updatedReport) => {
    try {
      await updateReport(updatedReport).unwrap();
      refetch();
      handleCloseDialog(); 
    } catch (error) {
      alert("Failed to update the report. Please try again.");
    }
  };

  const handleCreateReport = async (newReport) => {
    try {
      await createReport(newReport).unwrap(); 
      refetch(); 
      handleCloseDialog(); 
    } catch (error) {
      alert("Failed to create the report. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(id).unwrap();
        refetch(); 
      } catch (error) {
        alert("Failed to delete the report. Please try again.");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentReport(null);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setCurrentImageIndex(0);
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

      <DialogReportForm 
        open={openDialog} 
        onClose={handleCloseDialog} 
        reportData={currentReport} 
        onSave={currentReport ? handleUpdateReport : handleCreateReport} 
      />

      <ImagePreview 
        open={previewOpen}
        images={previewImages}
        currentIndex={currentImageIndex}
        onClose={handleClosePreview}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </Box>
  );
};

export default Reports;