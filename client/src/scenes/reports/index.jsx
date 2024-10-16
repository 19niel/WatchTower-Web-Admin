import React, { useState } from "react";
import { Box, useTheme, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

const Reports = () => {
  const theme = useTheme();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });
  const columns = [
    {
        field: "_id",
        headerName: "ID",
        flex: 1,
    },
    {
        field: "location",
        headerName: "Location",
        flex: 0.8,
    },
    {
        field: "disasterCategory",
        headerName: "Disaster Category",
        flex: 0.6,
    },
    {
        field: "disasterImage",
        headerName: "Images",
        flex: 0.6,
        renderCell: (params) => <img src={params.value} alt="Disaster-Image" width="100" />,
    },
    {
        field: "disasterInfo",
        headerName: "Description",
        flex: 1,
    },
    {
        field: "createdAt",
        headerName: "Date",
        flex: 0.5,
        renderCell: (params) => new Date(params.value).toLocaleDateString(), // Format date
    },
    {
        field: "rescuerName", // Should get the ID first 
        headerName: "Rescued By",
        flex: 1,
    },
    {
      field: "reporterName",
      headerName: "Reported By",
      flex: 1,
    },
    {
        field: "disasterStatus",
        headerName: "Status",
        flex: 0.5,
    },
    
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
          rows={(data && data.transactions) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
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
