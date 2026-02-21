import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-code">404</div>
                <h1>Page Not Found</h1>
                <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
                <div className="not-found-illustration">
                    <span>🔍</span>
                </div>
                <Link to="/" className="not-found-btn">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
