// components/UpcomingReservations/UpcomingReservations.jsx
import React from 'react';
import { Box, Typography, List, ListItem, Avatar, Chip } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './UpcomingReservations.css';

const reservations = [
  {
    id: 1,
    guestName: 'John & Sarah',
    dates: 'May 12-15',
    dateRange: 'May 12–15',
    status: 'Check-in Soon',
    statusColor: 'warning',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    id: 2,
    guestName: 'Lisa M.',
    dates: 'May 20-23',
    dateRange: 'May 20–23',
    status: 'Confirmed',
    statusColor: 'success',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: 3,
    guestName: 'Mark & Anna',
    dates: 'June 5-8',
    dateRange: 'June 5–8',
    status: 'New Booking',
    statusColor: 'info',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  }
];

export default function UpcomingReservations() {
  return (
    <Box className="upcoming-reservations">
      <Box className="reservations-header">
        <Typography variant="h6" className="section-title">
          Upcoming Reservations
        </Typography>
        <Box className="view-calendar-link">
          <Typography variant="body2" className="link-text">
            View Calendar
          </Typography>
          <ChevronRightIcon className="chevron-icon" />
        </Box>
      </Box>

      <List className="reservations-list">
        {reservations.map((reservation) => (
          <ListItem key={reservation.id} className="reservation-item">
            <Avatar 
              src={reservation.avatar} 
              className="guest-avatar"
            />
            <Box className="reservation-details">
              <Typography variant="body1" className="guest-name">
                {reservation.guestName}
              </Typography>
              <Typography variant="body2" className="reservation-dates">
                {reservation.dateRange}
              </Typography>
            </Box>
            <Box className="reservation-right">
              <Typography variant="body2" className="dates-text">
                {reservation.dates}
              </Typography>
              <Chip 
                label={reservation.status}
                className={`status-chip status-${reservation.statusColor}`}
                size="small"
              />
            </Box>
            <ChevronRightIcon className="arrow-icon" />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}