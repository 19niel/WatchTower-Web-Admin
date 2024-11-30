import React, { useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useGetOverallStatsQuery } from "state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2023-01-01"));
  const [endDate, setEndDate] = useState(new Date("2023-02-01"));
  const { data } = useGetOverallStatsQuery();
  const theme = useTheme();

  const formattedData = useMemo(() => {
    if (!data || !data.dailyData) return [];

    const { dailyData } = data;
    const totalReportsLine = {
      id: "totalReports",
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalReportsSolvedLine = {
      id: "totalReportsSolved",
      color: "#51A072",
      data: [],
    };

    Object.values(dailyData).forEach(({ date, totalReports, totalReportsSolved }) => {
      const dateFormatted = new Date(date);
      if (dateFormatted >= startDate && dateFormatted <= endDate) {
        const formattedDate = dateFormatted.toISOString().split("T")[0]; // Format as YYYY-MM-DD

        totalReportsLine.data.push({ x: formattedDate, y: totalReports });
        totalReportsSolvedLine.data.push({ x: formattedDate, y: totalReportsSolved });
      }
    });

    console.log("Formatted Data:", [totalReportsLine, totalReportsSolvedLine]);
    return [totalReportsLine, totalReportsSolvedLine];
  }, [data, startDate, endDate, theme]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY Reports" subtitle="Chart of daily reports" />
      <Box height="75vh">
        <Box display="flex" justifyContent="flex-end" mb="1rem">
          <Box mx="1rem">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
            />
          </Box>
          <Box mx="1rem">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
            />
          </Box>
        </Box>

        {data ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: { line: { stroke: theme.palette.secondary[200] } },
                legend: { text: { fill: theme.palette.secondary[200] } },
                ticks: {
                  line: { stroke: theme.palette.secondary[200], strokeWidth: 1 },
                  text: { fill: theme.palette.secondary[200] },
                },
              },
              legends: { text: { fill: theme.palette.secondary[200] } },
              tooltip: { container: { color: theme.palette.primary.main, color: 'black' } },  // Set color to black
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
              legend: "Date",
              legendOffset: 50,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total Reports",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            tooltip={({ point }) => (
              <div
                style={{
                  background: "white",
                  padding: "5px",
                  borderRadius: "3px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                  color: "black", // Set the text color to black
                }}
              >
                <strong>Date:</strong> {point.data.x}
                <br />
                <strong>Value:</strong> {point.data.y}
              </div>
            )}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                translateX: 50,
                translateY: 0,
                itemsSpacing: 0,
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Daily;
