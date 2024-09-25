import React from 'react';
import { Box, useTheme } from "@mui/material";
import { useGetRescuersQuery } from 'state/api'; 
import Header from "components/Header";
import { DataGrid } from '@mui/x-data-grid';

const Rescuers = () => {
    const theme = useTheme();
    const { data, isLoading, error } = useGetRescuersQuery();

    if (error) return <div>Error: {error.message}</div>; // Handle error state

    const columns = [
        {
            field: "_id",
            headerName: "ID",
            flex: 0.8,
        },
        {
            field: "profileImage",
            headerName: "Image",
            flex: 0.5,
        },
        {
            field: "firstName",
            headerName: "First Name",
            flex: 0.5,
        },
        {
            field: "lastName",
            headerName: "Last Name",
            flex: 0.5,
        },
        {
            field: "mobileNumber",
            headerName: "Phone Number",
            flex: 0.5,
            renderCell: (params) => {
                return params.value.replace(/^(\d{4})(\d{3})(\d{3})/, "$1-$2-$3");
            }
        },
        {
            field: "address",
            headerName: "Address",
            flex: 0.8,
            renderCell: (params) => {
                const address = params.value || {};  // Ensure address object exists
                const { houseNumber = "", street = "", barangay = "" } = address;
                return `${houseNumber}, ${street}, ${barangay}`;
            },
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.5,
        },
    ];

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="Rescuers" subtitle="List of Rescuers" />
            <Box mt="40px" height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "1px"
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none"
                    },
                    "& .MuiDataGrid": {
                        backgroundColor: theme.palette.background.alt,
                        color: theme.palette.secondary[100],
                        borderBottom: "none"
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: theme.palette.primary.light,
                    },
                    "& .MuiDataGrid-footerContainer": {
                        backgroundColor: theme.palette.background.alt,
                        color: theme.palette.secondary[100],
                        borderTop: "none"
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${theme.palette.secondary[200]} !important`
                    }
                }}
            >
                <DataGrid
                    loading={isLoading || !data}
                    getRowId={(row) => row._id}
                    rows={data || []}
                    columns={columns}
                />
            </Box>
        </Box>
    );
}

export default Rescuers;
