import React from "react";
import "./PageLoader.css";

const PageLoader = () => {
    return (
        <div className="page-loader">
            <div className="loader-container">
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
        </div>
    );
};

export default PageLoader;
