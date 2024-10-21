import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetReportsQuery } from "state/api"; // Ensure this is used
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

const Reports = () => {
  const theme = useTheme();

  // Pagination and sorting states
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetching reports using the query hook
  const { data, isLoading } = useGetReportsQuery();

  // Define the columns for the DataGrid
  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "disasterCategory", headerName: "Disaster Category", flex: 1 },
    {
      field: "disasterImages",
      headerName: "Images",
      flex: 1,
      renderCell: (params) => (
        params.value[0] !== "No Images" ? (
          <img src={params.value[0]} alt="Disaster" width="100" />
        ) : (
          <span>No Images</span>
        )
      ),
    },
    { field: "disasterInfo", headerName: "Description", flex: 1 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 0.5,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "rescuerId", headerName: "Rescued By", flex: 1 }, // Use rescuerId instead of rescuerName if applicable
    { field: "reportedBy", headerName: "Reported By", flex: 1 },
    { field: "disasterStatus", headerName: "Status", flex: 0.5 },
  ];

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
          rows={(data && data) || []} // Adjusted to use data directly
          columns={columns}
          rowCount={(data && data.length) || 0} // Updated to reflect length of data
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
    </Box>
  );
};

export default Reports;
