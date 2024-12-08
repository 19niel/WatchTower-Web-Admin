import React from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import { useFetchReportsQuery } from "state/reportApi";
import StatBox from "components/StatBox";
import { getImageUrlById } from "utils/imageUtils";
import { useGetDashboardQuery } from "state/api";
import { useGetReportsTodayQuery } from "state/dashboardApi"; // Import the new query

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data: reportsData, isLoading } = useFetchReportsQuery();
  const { data: totalCitizens } = useGetDashboardQuery();
  const { data: reportsTodayData, isLoading: isTodayLoading } = useGetReportsTodayQuery();


  const columns = [
    { field: "location", headerName: "Location", flex: 1 },
    { field: "disasterCategory", headerName: "Disaster Category", flex: 1 },
    {
      field: "disasterImages",
      headerName: "Images",
      flex: 1,
      renderCell: (params) => {
        const images = params.value;
        if (!Array.isArray(images) || images.length === 0) {
          return <span>No Images</span>;
        }
        return (
          <Box display="flex" gap="5px">
            {images.slice(0, 3).map((imageId, index) => (
              <img
                key={index}
                src={getImageUrlById(imageId)} // Use getImageUrlById to get the full image URL
                alt={`Disaster ${index + 1}`}
                width="80"
                style={{ borderRadius: "5px", cursor: "pointer" }}
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
    { field: "disasterStatus", headerName: "Status", flex: 0.7 },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Citizens"
          value={totalCitizens && totalCitizens.totalCitizens}
          increase="10%"
          description="Since last month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
      <StatBox
        title="Reports Today"
        value={reportsTodayData && reportsTodayData.reportsTodayData}
        increase="+21%"
        description="Since last month"
        icon={
          <PointOfSale
            sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
          />
        }
      />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>
        <StatBox
          title="Monthly Reports"
          value={reportsData && reportsData.monthlyReports}
          increase="+5%"
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Yearly Reports"
          value={reportsData && reportsData.yearlyReports}
          increase="+43%"
          description="Since last month"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
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
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
          }}
        >
          <DataGrid
            loading={isLoading || !reportsData}
            getRowId={(row) => row._id}
            rows={reportsData || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Reports By Category
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown of reports based on their category.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
