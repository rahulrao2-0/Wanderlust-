import "./Filterbar.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Filterbar() {
    const [activeFilter, setActiveFilter] = useState('all');
    const navigate = useNavigate();

    const filters = [
        { id: 'all', label: 'All', icon: 'fa-solid fa-reply-all' },
        { id: 'beach', label: 'Beaches', icon: 'fas fa-umbrella-beach' },
        { id: 'cabins', label: 'Cabins', icon: 'fa-solid fa-house-chimney' },
        { id: 'countryside', label: 'Countryside', icon: 'fas fa-tree' },
        { id: 'city', label: 'City', icon: 'fa-regular fa-building' },
        { id: 'luxury', label: 'Luxury', icon: 'fas fa-gem' }
    ];

    const handleFilter = (filterId) => {
        if(filterId=== "all") {
            window.location.href = "/"; // Navigate to home page for "All" filter
        } // Guard: prevent redundant state updates
        setActiveFilter(filterId);
    };

    return (
        <div className="filterbar">
            <div className="filters-container">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => handleFilter(filter.id)}
                    >
                        <i className={filter.icon}></i>
                        <span>{filter.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}