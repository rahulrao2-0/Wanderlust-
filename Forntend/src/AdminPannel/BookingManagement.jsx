import React from 'react';
import './BookingManagement.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BookingManagement = ({ latestBookings = [], last7DaysBookings = [] }) => {

    console.log("Last 7 Days Chart Data:", last7DaysBookings);

    // ✅ Calculate Total Earnings
    const totalPrice = latestBookings.reduce(
        (acc, booking) => acc + booking.totalPrice,
        0
    );

    // ✅ Format INR
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="booking-management">
            <div className="panel-title">Booking Management</div>

            <div className="booking-stats">
                <span>{latestBookings.length} New Bookings</span>
                <span>{formatPrice(totalPrice)} Total Earnings</span>
            </div>

            {/* 🔥 Chart Section */}
            <div className="booking-chart" style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={last7DaysBookings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="bookings"
                            stroke="#4f46e5"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="booking-map">
                <div className="map-placeholder">[Map]</div>
            </div>
        </div>
    );
};

export default BookingManagement;