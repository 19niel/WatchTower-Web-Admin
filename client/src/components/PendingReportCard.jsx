// client/src/components/PendingReportCard.jsx

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check'; // Import check icon
import CloseIcon from '@mui/icons-material/Close'; // Import close icon

const PendingReportCard = ({ report, onActivate, onDelete }) => {
  return (
    <Card sx={{ width: '20%', margin: 2 }}> {/* Adjust width as needed */}
      <CardMedia
        sx={{ height: 140 }}
        image={report.disasterImages[0]} // Display the first disaster image
        title={report.disasterCategory}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {report.disasterCategory}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {report.disasterInfo}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Reported By: {report.reportedBy}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Date: {new Date(report.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={() => onActivate(report._id)}>
          <CheckIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(report._id)}>
          <CloseIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PendingReportCard;
