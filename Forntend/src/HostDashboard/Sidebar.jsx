// components/Sidebar/Sidebar.jsx
import React, { useState } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EventIcon from "@mui/icons-material/Event";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import "./Sidebar.css";

export default function Sidebar({ setActiveView }) {
  const [selected, setSelected] = useState("dashboard");

  const handleClick = (id) => {
    setSelected(id);
    setActiveView(id);   // ⭐ tell parent what to show
  };

  return (
    <Box className="sidebar">
      <List className="sidebar-list">
        
        {/* Dashboard */}
        <ListItem
          className={`sidebar-item ${selected === "dashboard" ? "active" : ""}`}
          onClick={() => handleClick("dashboard")}
        >
          <ListItemIcon className="sidebar-icon">
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* Listings */}
        <ListItem
          className={`sidebar-item ${selected === "listings" ? "active" : ""}`}
          onClick={() => handleClick("listings")}
        >
          <ListItemIcon className="sidebar-icon">
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="Listings" />
        </ListItem>

        {/* Reservations */}
        <ListItem
          className={`sidebar-item ${selected === "reservations" ? "active" : ""}`}
          onClick={() => handleClick("reservations")}
        >
          <ListItemIcon className="sidebar-icon">
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Reservations" />
        </ListItem>

        {/* Calendar */}
        <ListItem
          className={`sidebar-item ${selected === "calendar" ? "active" : ""}`}
          onClick={() => handleClick("calendar")}
        >
          <ListItemIcon className="sidebar-icon">
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </ListItem>

        {/* Earnings */}
        <ListItem
          className={`sidebar-item ${selected === "earnings" ? "active" : ""}`}
          onClick={() => handleClick("earnings")}
        >
          <ListItemIcon className="sidebar-icon">
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Earnings" />
        </ListItem>

        {/* Inbox */}
        <ListItem
          className={`sidebar-item ${selected === "inbox" ? "active" : ""}`}
          onClick={() => handleClick("inbox")}
        >
          <ListItemIcon className="sidebar-icon">
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>

        {/* Profile */}
        <ListItem
          className={`sidebar-item ${selected === "profile" ? "active" : ""}`}
          onClick={() => handleClick("profile")}
        >
          <ListItemIcon className="sidebar-icon">
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
    </Box>
  );
}
