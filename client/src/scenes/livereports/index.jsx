import React, { useEffect, useState } from "react";
import { Box, useTheme, Typography, Paper } from "@mui/material";
import Header from "components/Header";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios"; // Import axios

const LiveReports = () => {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  
  const columns = [
    { id: "pending", title: "On Progress", tasks: [] },
    { id: "high", title: "High Priority", tasks: [] },
    { id: "medium", title: "Medium Priority", tasks: [] },
    { id: "low", title: "Low Priority", tasks: [] },
    { id: "active", title: "Active", tasks: [] },
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5001/reports"); // Adjust the endpoint if necessary
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const onDragEnd = (result) => {
    // Implement your logic to handle the drag-and-drop functionality here
    console.log(result);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Live Reports" subtitle="See All The Live Reports Today" />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <Box
              mt="40px"
              display="flex"
              justifyContent="space-between"
              height="78vh"
              border={`1px solid ${theme.palette.secondary[200]}`}
              borderRadius="4px"
              padding="10px"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columns.map((column) => {
                // Filter reports based on the column ID
                const filteredReports = column.id === "active"
                  ? reports.filter(report => report.disasterStatus === "active")
                  : []; // Add more filtering logic for other columns as needed

                return (
                  <Droppable key={column.id} droppableId={column.id}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        flex={1}
                        margin="0 10px"
                        display="flex"
                        flexDirection="column"
                        border={`1px solid ${theme.palette.secondary[200]}`}
                        borderRadius="4px"
                        padding="10px"
                      >
                        <Typography variant="h6" gutterBottom>
                          {column.title}
                        </Typography>
                        <Paper elevation={1} style={{ flexGrow: 1, overflowY: 'auto' }}>
                          {filteredReports.length === 0 ? (
                            <Typography variant="body2" color="textSecondary" align="center">
                              No tasks
                            </Typography>
                          ) : (
                            filteredReports.map((report, taskIndex) => (
                              <Draggable key={report._id} draggableId={report._id} index={taskIndex}>
                                {(provided) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    padding="5px"
                                    borderRadius="4px"
                                    marginBottom="5px"
                                    bgcolor={theme.palette.primary.light}
                                  >
                                    <Typography variant="body1">{report.disasterCategory}</Typography>
                                    <Typography variant="body2">{report.location}</Typography>
                                    <Typography variant="body2">{report.disasterInfo}</Typography>
                                    <Box display="flex" gap="8px" mt={1}>
                                      {report.disasterImages.map((imageId) => (
                                        <img
                                          key={imageId}
                                          src={`http://localhost:5001/reports/image/${imageId}`} // Use your getImage URL
                                          alt="Disaster"
                                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                                        />
                                      ))}
                                    </Box>
                                  </Box>
                                )}
                              </Draggable>
                            ))
                          )}
                        </Paper>
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                );
              })}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default LiveReports;
