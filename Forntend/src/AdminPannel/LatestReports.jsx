import React from 'react';
import './LatestReports.css';

const LatestReports = () => (
    <div className="latest-reports">
        <div className="panel-title">Latest Reports</div>
        <div className="report-list">
            <div className="report-item">
                <span className="report-title">Spam Listing Reported</span>
                <span className="report-status pending">Pending</span>
            </div>
            <div className="report-item">
                <span className="report-title">Payment Issue</span>
                <span className="report-status resolved">Resolved</span>
            </div>
            <button className="view-reports-btn">View All Reports</button>
        </div>
    </div>
);

export default LatestReports;
