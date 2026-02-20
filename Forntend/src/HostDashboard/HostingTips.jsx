// components/HostingTips/HostingTips.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './HostingTips.css';

export default function HostingTips() {
  return (
    <Card className="hosting-tips-card">
      <Box className="tips-image-section">
        <img 
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500" 
          alt="Hosting tips"
          className="tips-background"
        />
      </Box>
      <CardContent className="tips-content">
        <Typography variant="h6" className="tips-title">
          Hosting Tips & Resources
        </Typography>
        <Typography variant="body2" className="tips-description">
          Get tips to improve your hosting experience.
        </Typography>
        <Button 
          variant="contained" 
          endIcon={<ChevronRightIcon />}
          className="explore-btn"
        >
          Explore Tips
        </Button>
      </CardContent>
    </Card>
  );
}