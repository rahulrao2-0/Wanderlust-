import React from 'react';
import './UserManagement.css';

const UserManagement = ({ latestUsers }) => (
    console.log("Latest Users in UserManagement component:", latestUsers),
    <div className="user-management">
        <div className="panel-title">User Management</div>
        <div className="user-list">
            {latestUsers.map((user) => (
                <div className="user-item" key={user._id}>
                    <span className={`user-avatar ${user.role}`} />
                    <span className="user-email">{user.email}</span>
                    <span className="user-role">{user.role}</span>
                    <button className="view-btn">View</button>
                </div>
            ))}
            
            
            <div className="user-actions">
                <button className="view-btn">View</button>
                <button className="block-btn">Block</button>
            </div>
        </div>
    </div>
);

export default UserManagement;
