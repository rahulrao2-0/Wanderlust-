import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import YourListings from "./YourListings.jsx";
import UpcomingReservations from "./UpcomingReservations.jsx";
import HostingTips from "./HostingTips.jsx";
import Calendar from "./Calendar.jsx";
import Earning from "./Earning.jsx";
import "./MainHostDashboard.css";
import { useAuth } from "../PropertyDetails/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import HostAllListings from "./HostAllListings.jsx";
import Reservations from "./Reservations.jsx";

export default function MainHostDashboard() {
  const { user, loading } = useAuth();

  // ⭐ which page to show
  const [activeView, setActiveView] = useState("dashboard");

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Box className="dashboard-wrapper">
      <Header User={user} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={2.5} lg={2}>
            {/* pass function */}
            <Sidebar setActiveView={setActiveView} />
          </Grid>

          {/* Main Area */}
          <Grid item xs={12} md={9.5} lg={10}>

            {/* 🟢 DASHBOARD DEFAULT */}
            {activeView === "dashboard" && (
              <>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} lg={7}>
                    <YourListings />
                  </Grid>
                  <Grid item xs={12} lg={5}>
                    <UpcomingReservations />
                  </Grid>
                </Grid>
              </>
            )}

            {/* 🟢 ALL LISTINGS */}
            {activeView === "listings" && <HostAllListings />}

            {/* 🟢 RESERVATIONS PAGE */}
            {activeView === "reservations" && <Reservations />}

            {/* 🟢 CALENDAR PAGE */}
            {activeView === "calendar" && (
              <Box sx={{ p: 2 }}>
                <Calendar />
              </Box>
            )}

            {/* 🟢 EARNINGS PAGE */}
            {activeView === "earnings" && (
              <Box sx={{ p: 2 }}>
                <Earning />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
