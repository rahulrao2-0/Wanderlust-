import React, { useState } from "react";
import "./Earning.css";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect,useContext } from "react";


export default function Earning() {
    const [timeRange, setTimeRange] = useState("month");
    const [totalEarnings, setTotalEarnings] = useState(0);  
    const [growth, setGrowth] = useState(0);
    const [bookings, setBookings] = useState(0);
    const[data,setData] = useState("")


    useEffect(()=>{
        const fechData = async()=>{
            const response = await fetch("http://localhost:5000/api/host/earnings",{
                method:"GET",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"}
            })
            const data = await response.json();
            console.log(data)
            setData(data)
            setTotalEarnings(data.totalEarnings);
            // setGrowth(data.growth);
            setBookings(data.totalBooking);
        }
        fechData();
    },[])
    const earningData = {
        month: {
            total: data.monthlyEarning,
            percentage: 12.5,
            bookings: data.monthlyBookingsCount,
            breakdown: [
                { label: "Week 1", value: 1200 },   
                { label: "Week 2", value: 1150 },
                { label: "Week 3", value: 1250 },
                { label: "Week 4", value: 1250 },
            ],
        },
        year: {
            total: data.totalEarnings,
            percentage: 23.4,
            bookings: data.totalBooking,
            breakdown: [
                { label: "Q1", value: 14500 },
                { label: "Q2", value: 15200 },
                { label: "Q3", value: 14800 },
                { label: "Q4", value: 13700 },
            ],
        },
    };

    const currentData = earningData[timeRange];
    const maxValue = Math.max(...currentData.breakdown.map((item) => item.value));

    return (
        <div className="earningContainer">
            <div className="earningHeader">
                <h3 className="earningTitle">Earnings</h3>
                <button className="optionsBtn">
                    <MoreVertIcon />
                </button>
            </div>

            <div className="earningStats">
                <div className="statBox">
                    <div className="statIcon">
                        <AttachMoneyIcon />
                    </div>
                    <div className="statContent">
                        <p className="statLabel">Total Earnings</p>
                        <p className="statValue">₹{totalEarnings}</p>
                    </div>
                </div>

                

                <div className="statBox">
                    <div className="statIcon">
                        <DateRangeIcon />
                    </div>
                    <div className="statContent">
                        <p className="statLabel">Bookings</p>
                        <p className="statValue">{bookings}</p>
                    </div>
                </div>
            </div>

            <div className="timeRangeSelector">
                <button
                    className={`timeBtn ${timeRange === "month" ? "active" : ""}`}
                    onClick={() => setTimeRange("month")}
                >
                    Month
                </button>
                <button
                    className={`timeBtn ${timeRange === "year" ? "active" : ""}`}
                    onClick={() => setTimeRange("year")}
                >
                    Year
                </button>
            </div>

            <div className="chartContainer">
                <div className="chartLabel">Earnings Breakdown</div>
                <div className="chart">
                    {currentData.breakdown.map((item, index) => (
                        <div key={index} className="barWrapper">
                            <div className="barContainer">
                                <div
                                    className="bar"
                                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                                ></div>
                            </div>
                            <p className="barLabel">{item.label}</p>
                            <p className="barValue">₹{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
