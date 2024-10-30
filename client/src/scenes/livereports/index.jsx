import React from "react";
import { Box, useTheme, Typography, Paper } from "@mui/material";
import Header from "components/Header";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const LiveReports = () => {
  const theme = useTheme();

  const columns = [
    { id: "pending", title: "On Progress", tasks: [] },
    { id: "high", title: "High Priority", tasks: [] },
    { id: "medium", title: "Medium Priority", tasks: [] },
    { id: "low", title: "Low Priority", tasks: [] },
    { id: "unverified", title: "Unverified", tasks: [] },
  ];

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
              {columns.map((column, index) => (
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
                          column.tasks.map((task, taskIndex) => (
                            <Draggable key={taskIndex} draggableId={String(taskIndex)} index={taskIndex}>
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
                                  {task}
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
