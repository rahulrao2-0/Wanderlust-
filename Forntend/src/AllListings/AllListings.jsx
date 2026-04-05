import "./AllListings.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Rating from "@mui/material/Rating";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const fetchListings = async () => {
  const res = await fetch("https://wanderlust-1-s261.onrender.com/api/listings", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch listings");

  return res.json();
};

function ListingSkeletonCard() {
  return (
    <div className="listingCard">
      <div className="cardImageWrapper">
        <Skeleton height={220} borderRadius={12} />
      </div>

      <div className="cardContent">
        <h3 className="listingTitle">
          <Skeleton width="70%" height={28} />
        </h3>

        <p className="listingDescription">
          <Skeleton count={2} />
        </p>

        <div className="cardFooter">
          <div className="footer" style={{ width: "100%" }}>
            <span className="price">
              <Skeleton width={120} />
            </span>
            <span className="location">
              <Skeleton width={90} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const listings = searchResults.length > 0 ? searchResults : fetchedListings;

  if (error && searchResults.length === 0) {
    return (
      <div className="error-state">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="allListingsContainer">
      {isLoading && searchResults.length === 0
        ? Array.from({ length: 6 }).map((_, index) => (
            <ListingSkeletonCard key={index} />
          ))
        : listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/property/${listing._id}`}
              className="listingLink"
            >
              <div className="listingCard">
                <div className="cardImageWrapper">
                  <img
                    src={listing.image?.[0]?.url}
                    alt={listing.title}
                    className="cardImage"
                  />
                  <div className="cardOverlay"></div>
                </div>

                <div className="cardContent">
                  <h3 className="listingTitle">{listing.title}</h3>
                  <p className="listingDescription">{listing.description}</p>

                  <div className="cardFooter">
                    <div className="footer">
                      <span className="price">₹ {listing.price} / night</span>
                      <span className="location">{listing.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
}