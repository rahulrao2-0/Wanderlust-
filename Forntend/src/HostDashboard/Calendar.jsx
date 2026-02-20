import React, { useState } from "react";
import "./Calendar.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const today = new Date();
    const isCurrentMonth =
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();
    const todayDate = today.getDate();

    return (
        <div className="calendarContainer">
            <div className="calendarHeader">
                <h3 className="calendarTitle">Calendar</h3>
                <div className="calendarNav">
                    <button onClick={handlePrevMonth} className="navButton">
                        <ChevronLeftIcon />
                    </button>
                    <span className="monthYear">{monthName}</span>
                    <button onClick={handleNextMonth} className="navButton">
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>

            <div className="calendarWeekDays">
                <div className="weekDay">Sun</div>
                <div className="weekDay">Mon</div>
                <div className="weekDay">Tue</div>
                <div className="weekDay">Wed</div>
                <div className="weekDay">Thu</div>
                <div className="weekDay">Fri</div>
                <div className="weekDay">Sat</div>
            </div>

            <div className="calendarGrid">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`calendarDay ${day ? "hasDay" : ""} ${isCurrentMonth && day === todayDate ? "today" : ""
                            }`}
                    >
                        {day && <span className="dayNumber">{day}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}
