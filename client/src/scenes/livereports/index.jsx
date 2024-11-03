import React, { useEffect, useState } from "react";
import { Box, useTheme, Typography, Paper } from "@mui/material";
import Header from "components/Header";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

const LiveReports = () => {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [columns, setColumns] = useState({
    pending: { id: "pending", title: "On Progress", tasks: [] },
    high: { id: "high", title: "High Priority", tasks: [] },
    medium: { id: "medium", title: "Medium Priority", tasks: [] },
    low: { id: "low", title: "Low Priority", tasks: [] },
    active: { id: "active", title: "Active", tasks: [] },
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5001/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const newColumns = {
      pending: { id: "pending", title: "On Progress", tasks: [] },
      high: { id: "high", title: "High Priority", tasks: [] },
      medium: { id: "medium", title: "Medium Priority", tasks: [] },
      low: { id: "low", title: "Low Priority", tasks: [] },
      active: { id: "active", title: "Active", tasks: [] },
    };

    reports.forEach(report => {
      if (report.priority === "active") {
        newColumns.active.tasks.push(report);
      } else if (report.priority === "high") {
        newColumns.high.tasks.push(report);
      } else if (report.priority === "medium") {
        newColumns.medium.tasks.push(report);
      } else if (report.priority === "low") {
        newColumns.low.tasks.push(report);
      } else {
        newColumns.pending.tasks.push(report);
      }
    });

    setColumns(newColumns);
  }, [reports]);

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) {
      return; // Dropped outside a droppable
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // Dropped in the same position
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = [...destColumn.tasks];
    const [movedReport] = sourceTasks.splice(source.index, 1);
    
    // Only update the priority if not moved to the "On Progress" column
    if (destination.droppableId !== "pending") {
      movedReport.priority = destination.droppableId;
      
      // Update the report priority in the backend
      try {
        await axios.patch(`http://localhost:5001/reports/${movedReport._id}`, {
          priority: movedReport.priority,
        });
      } catch (error) {
        console.error("Error updating report priority:", error);
      }
    }

    // Add the moved report to the destination column
    destTasks.splice(destination.index, 0, movedReport);

    // Update the columns state
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destColumn, tasks: destTasks },
    });
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
              {Object.values(columns).map((column) => (
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
                        {column.tasks.length === 0 ? (
                          <Typography variant="body2" color="textSecondary" align="center">
                            No tasks
                          </Typography>
                        ) : (
                          column.tasks.map((report, index) => (
                            <Draggable key={report._id} draggableId={report._id} index={index}>
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  padding="5px"
                                  borderRadius="4px"
                                  marginBottom="5px"
                                  bgcolor={theme.palette.primary.light}
                                  style={{ cursor: "grab" }}
                                >
                                  <Typography variant="body1">{report.disasterCategory}</Typography>
                                  <Typography variant="body2">{report.location}</Typography>
                                  <Typography variant="body2">{report.disasterInfo}</Typography>
                                  <Box display="flex" gap="8px" mt={1}>
                                    {report.disasterImages.map((imageId) => (
                                      <img
                                        key={imageId}
                                        src={`http://localhost:5001/reports/image/${imageId}`}
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
              ))}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default LiveReports;
