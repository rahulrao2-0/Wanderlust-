import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import StatCards from "./StatCards";
import PropertyListings from "./PropertyListings";
import UserManagement from "./UserManagement";

import BookingManagement from "./BookingManagement";
import LatestReports from "./LatestReports";

import "./AdminDashboard.css";
import { useState, useEffect } from "react";



export default function AdminDashboard() {

    const [TotalListings, setTotalListings] = useState(0);
    const [PendingApprovals, setPendingApprovals] = useState(0);
    const [TotalUsers, setTotalUsers] = useState(0);
    const [TotalBookings, setTotalBookings] = useState(0);
    const[latestReports, setLatestReports] = useState([]);
    const[latestBookings, setLatestBookings] = useState([]);
    const[latestUsers, setLatestUsers] = useState([]);
    const[latestListings, setLatestListings] = useState([]);
    const[last7daysbookings, setLast7DaysBookings] = useState([]);

    useEffect(() => {  
        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/admin/stats", {
                    credentials: "include",
                });

                const data = await response.json();

                console.log("Stats data:", data);

                setTotalListings(data.totalListings);
                setTotalUsers(data.totalUsers);
                setTotalBookings(data.totalBookings);
                setPendingApprovals(data.pendingApprovals);
                setLatestReports(data.latestReports);
                setLatestBookings(data.latestBookings);
                console.log("Latest Bookings in AdminDashboard:", data.latestBookings)
                setLatestUsers(data.latestUsers);
                setLatestListings(data.latestListings);
                setLast7DaysBookings(data.last7Daysbookings);
                console.log("Last 7 Days Bookings in AdminDashboard:", data.last7Daysbookings)
                

            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []); 

    console.log("Latest Bookings in AdminDashboard:", latestBookings)

    return (
        <div className="admin-dashboard">
            <Sidebar />
            <main className="dashboard-main">
                <DashboardHeader />
                <StatCards 
                    totalListings={TotalListings}
                    totalUsers={TotalUsers}
                    totalBookings={TotalBookings}
                    pendingApprovals={PendingApprovals}
                />
                <div className="dashboard-content">
                    <div className="dashboard-row">
                        <div className="dashboard-col"><PropertyListings latestListings={latestListings}/></div>
                        <div className="dashboard-col"><UserManagement latestUsers={latestUsers}/></div>
                        
                    </div>
                    <div className="dashboard-row">
                        <div className="dashboard-col"><BookingManagement latestBookings={latestBookings} last7DaysBookings={last7daysbookings}/></div>
                        <div className="dashboard-col"><LatestReports latestReports={latestReports}/></div>
                        
                    </div>
                </div>
            </main>
        </div>
    );
}