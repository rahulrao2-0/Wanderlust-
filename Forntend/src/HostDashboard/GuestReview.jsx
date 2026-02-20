// components/GuestReviews/GuestReviews.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './GuestReview.css';

export default function GuestReviews() {
  return (
    <Card className="guest-reviews-card">
      <Box className="reviews-image-section">
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500" 
          alt="Guest reviews"
          className="reviews-background"
        />
      </Box>
      <CardContent className="reviews-content">
        <Typography variant="h6" className="reviews-title">
          Guest Reviews
        </Typography>
        <Typography variant="h5" className="review-quote">
          "Excellent Stay!"
        </Typography>
        <Typography variant="body2" className="review-text">
          "We loved the place, amazing view and great host!" — <em>Emily & James</em>
        </Typography>
        <Button 
          variant="contained" 
          endIcon={<ChevronRightIcon />}
          className="read-reviews-btn"
        >
          Read Reviews
        </Button>
      </CardContent>
    </Card>
  );
}