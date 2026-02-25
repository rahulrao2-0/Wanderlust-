import React from 'react';
import './DashboardHeader.css';
import { useState, useEffect } from "react";
import { useAuth } from '../PropertyDetails/AuthContext';

const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
})

const DashboardHeader = () => {
    const { user } = useAuth();     
    return (
        <header className="dashboard-header">
            <div>
                <h2>Welcome, {user?.user?.name || "Admin"}</h2>
                <span className="dashboard-date">{currentDate}</span>
            </div>
        <div className="dashboard-actions">
            <span className="dashboard-notification">
                <i className="icon-bell" />
                <span className="notification-badge">1</span>
            </span>
            <span className="dashboard-profile">My Content</span>
        </div>
    </header>
    );
}


export default DashboardHeader;
