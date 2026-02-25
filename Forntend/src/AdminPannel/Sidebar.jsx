import React from 'react';
import './Sidebar.css';

const Sidebar = () => (
    <aside className="AdminSidebar">
        <div className="sidebar-header">Admin Dashboard</div>
        <nav className="sidebar-nav">
            <ul>
                <li>Dashboard</li>
                <li>Listings</li>
                <li>Bookings</li>
                <li>Users</li>
                <li>Reports</li>
                <li>Analytics</li>
                <li>Settings</li>
            </ul>
        </nav>
    </aside>
);

export default Sidebar;
