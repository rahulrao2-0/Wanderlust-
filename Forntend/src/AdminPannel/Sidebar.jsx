import React, { useState } from 'react';
import './Sidebar.css';

const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'listings', label: 'Listings' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'users', label: 'Users' },
    { id: 'reports', label: 'Reports' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
];

export default function Sidebar({ setActiveView }) {
    const [selected, setSelected] = useState('dashboard');

    const handleClick = (id) => {
        setSelected(id);
        if (setActiveView) setActiveView(id);
    };

    return (
        <aside className="AdminSidebar">
            <div className="sidebar-header">Admin Dashboard</div>
            <nav className="sidebar-nav">
                <ul>
                    {sidebarItems.map((item) => (
                        <li
                            key={item.id}
                            className={selected === item.id ? 'active' : ''}
                            onClick={() => handleClick(item.id)}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
