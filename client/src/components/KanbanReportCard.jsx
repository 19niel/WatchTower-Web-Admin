// ReportCard.jsx
import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

const ReportCard = ({ report, onClick }) => {
  const { disasterCategory, location, disasterImages } = report;

  return (
    <Card onClick={onClick} sx={{ cursor: 'pointer', margin: '10px' }}>
      <CardMedia
        component="img"
        alt="Disaster Image"
        height="140"
        image={disasterImages[0] !== "No Images" ? disasterImages[0] : 'placeholder-image-url'} // replace with a placeholder if no images
      />
      <CardContent>
        <Typography variant="h6">{disasterCategory}</Typography>
        <Typography variant="body2" color="textSecondary">
          {location}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
