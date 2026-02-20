import "./AllListings.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Rating from "@mui/material/Rating";

const fetchListings = async () => {
  const res = await fetch("http://localhost:5000/api/listings", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch listings");

  return res.json();
};

export default function AllListings({ searchResults = [] }) {
  
  const {
    data: fetchedListings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });

  // 🔥 Decide what to display
  const listings =
    searchResults.length > 0 ? searchResults : fetchedListings;

  if (isLoading && searchResults.length === 0)
    return (
      <div className="loading-state">
        <p>Loading listings...</p>
      </div>
    );

  if (error && searchResults.length === 0)
    return (
      <div className="error-state">
        <p>Error: {error.message}</p>
      </div>
    );

  return (
    <div className="allListingsContainer">
      {listings.map((listing) => (
        <Link
          key={listing._id}
          to={`/property/${listing._id}`}
          className="listingLink"
        >
          <div className="listingCard">
            <div className="cardImageWrapper">
              <img
                src={listing.image.url}
                alt={listing.title}
                className="cardImage"
              />
              <div className="cardOverlay"></div>
            </div>

            <div className="cardContent">
              <h3 className="listingTitle">{listing.title}</h3>
              <p className="listingDescription">
                {listing.description}
              </p>

              <div className="cardFooter">
                <Rating
                  name="read-only"
                  value={4}
                  readOnly
                  size="small"
                />
                <span className="reviewCount">(48 reviews)</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}