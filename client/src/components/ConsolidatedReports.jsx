import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useGetReportsTodayQuery } from "../state/dashboardApi";
import SummarizeIcon from "@mui/icons-material/Summarize";
import axios from "axios";

const ConsolidatedReports = () => {
  const theme = useTheme();
  const [reportsToday, setReportsToday] = useState({
    reportsByFloodToday: { count: 0, reportIds: [] },
    reportsByFireToday: { count: 0, reportIds: [] },
    reportsByTyphoonToday: { count: 0, reportIds: [] },
    reportsByOthersToday: { count: 0, reportIds: [] },
    totalReportsToday: 0,
  });

  const [imagesByCategory, setImagesByCategory] = useState({
    reportsByFloodToday: [],
    reportsByFireToday: [],
    reportsByTyphoonToday: [],
    reportsByOthersToday: [],
  });

  const { data: reportsTodayData, isLoading, error } = useGetReportsTodayQuery();

  useEffect(() => {
    if (reportsTodayData) {
      setReportsToday(reportsTodayData);

      const fetchImages = async () => {
        const newImagesByCategory = {};

        for (const category of Object.keys(reportsTodayData)) {
          if (category !== "totalReportsToday") {
            const imagePromises = reportsTodayData[category].reportIds.map(async (reportId) => {
              try {
                // Fetch the full report data by ID
                const response = await axios.get(`http://localhost:5001/reports/${reportId}`);
                const report = response.data;

                // Extract image URLs from the report's disasterImages field
                const imageUrls = (report.disasterImages || []).map(
                  (imageId) => `http://localhost:5001/reports/image/${imageId}`
                );

                return imageUrls;
              } catch (err) {
                console.error(`Error fetching report ${reportId}:`, err);
                return [];
              }
            });

            const images = (await Promise.all(imagePromises)).flat();
            newImagesByCategory[category] = images;
          }
        }

        setImagesByCategory(newImagesByCategory);
      };

      fetchImages();
    }
  }, [reportsTodayData]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Error fetching reports data.</Typography>;

  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="0.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <FlexBetween>
        <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
          Reports Happening Today
        </Typography>
        <SummarizeIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />
      </FlexBetween>

      {/* Grid Layout for 4 Columns */}
      <Box mt={2} display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
        {Object.keys(reportsToday).map((category) => {
          if (category !== "totalReportsToday") {
            const categoryData = reportsToday[category];
            const images = imagesByCategory[category] || [];
            return (
              <Box
                key={category}
                display="flex"
                flexDirection="column"
                alignItems="center"
                padding="1rem"
                borderRadius="0.55rem"
                boxShadow={2}
                height="250px"
                sx={{ border: `2px solid white` }}
              >
                <Typography variant="h6" sx={{ color: theme.palette.secondary[300], mb: 1 }}>
                  {category.replace("reportsBy", "").replace("Today", "")}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
                  {categoryData.count} reports
                </Typography>
                <Box
                  mt={2}
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="center"
                  gap={1}
                  sx={{ overflowY: "auto", maxHeight: "150px" }}
                >
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Report ${category} ${index}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "0.25rem",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            );
          }
          return null;
        })}
      </Box>
    </Box>
  );
};

export default ConsolidatedReports;
