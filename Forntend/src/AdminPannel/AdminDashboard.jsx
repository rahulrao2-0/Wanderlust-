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
const [latestReports, setLatestReports] = useState([]);
const [latestBookings, setLatestBookings] = useState([]);
const [latestUsers, setLatestUsers] = useState([]);
const [latestListings, setLatestListings] = useState([]);
const [last7daysbookings, setLast7DaysBookings] = useState([]);
const [activeView, setActiveView] = useState('dashboard');
const [AllListings, setAllListings] = useState([]);
const [AllUsers, setAllUsers] = useState([]);
const [AllBookings, setAllBookings] = useState([]);

useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await fetch("https://wanderlust-cpfz.onrender.com/api/admin/stats", {
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
            setAllListings(data.AllListings);
            setAllUsers(data.AllUsers);
            setAllBookings(data.AllBookings);
            console.log("Last 7 Days Bookings in AdminDashboard:", data.last7Daysbookings)


        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    fetchStats();
}, []);

console.log("Latest Bookings in AdminDashboard:", latestBookings)

return (
    <>
        <div className="admin-dashboard">
            <Sidebar setActiveView={setActiveView} />
            <main className="dashboard-main">
                <DashboardHeader />
                <StatCards
                    totalListings={TotalListings}
                    totalUsers={TotalUsers}
                    totalBookings={TotalBookings}
                    pendingApprovals={PendingApprovals}
                />
                <div className="dashboard-content">
                    {/* Render content based on activeView */}
                    {activeView === 'dashboard' && (
                        <>
                            <div className="dashboard-row">
                                <div className="dashboard-col"><PropertyListings latestListings={latestListings} /></div>
                                <div className="dashboard-col"><UserManagement latestUsers={latestUsers} /></div>
                            </div>
                            <div className="dashboard-row">
                                <div className="dashboard-col"><BookingManagement latestBookings={latestBookings} last7DaysBookings={last7daysbookings} /></div>
                                <div className="dashboard-col"><LatestReports latestReports={latestReports} /></div>
                            </div>
                        </>
                    )}
                    {activeView === 'listings' && <PropertyListings latestListings={AllListings} />}
                    {activeView === 'bookings' && <BookingManagement latestBookings={AllBookings} last7DaysBookings={last7daysbookings} />}
                    {activeView === 'users' && <UserManagement latestUsers={AllUsers} />}
                    {activeView === 'reports' && <LatestReports latestReports={latestReports} />}
                    {/* Add more views as needed */}
                </div>
            </main>
        </div>
    </>
);
}