import React from 'react';
import './PropertyListings.css';

const PropertyListings = ({ latestListings }) => (
    console.log("Latest Listings in PropertyListings component:", latestListings),
    <div className="property-listings">
        <div className="panel-title">Property Listings</div>
        <table className="property-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Host</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {latestListings.map((listing) => (
                    <tr key={listing._id}>
                        <td>{listing.title}</td>
                        <td>{listing.host?.name || "Unknown Host"}</td>
                        <td><span className="status pending">{listing.status}</span></td>
                        <td><button className="delete-btn">Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default PropertyListings;
