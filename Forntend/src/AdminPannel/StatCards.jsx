import React from 'react';
import './StatCards.css';

const StatCards = ({totalListings, totalUsers, totalBookings, pendingApprovals}) => (
    <section className="dashboard-stats">
        <div className="stat-card total-listings">
            <div className="stat-title">Total Listings</div>
            <div className="stat-value">{totalListings}</div>
        </div>
        <div className="stat-card pending-approvals">
            <div className="stat-title">Pending Approvals</div>
            <div className="stat-value">{pendingApprovals}</div>
        </div>
        <div className="stat-card total-users">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{totalUsers}</div>
        </div>
    </section>
);

export default StatCards;
