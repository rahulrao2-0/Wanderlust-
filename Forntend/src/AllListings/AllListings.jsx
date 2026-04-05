import "./AllListings.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// 🔥 Fetch Listings
const fetchListings = async () => {
  const res = await fetch(
    "https://wanderlust-1-s261.onrender.com/api/listings",
    { credentials: "include" }
  );

  if (!res.ok) throw new Error("Failed to fetch listings");

  return res.json();
};

// 🔥 3D Mouse Move Effect
const handleMouseMove = (e, card) => {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const midX = rect.width / 2;
  const midY = rect.height / 2;

  const rotateX = ((y - midY) / midY) * 10;
  const rotateY = ((x - midX) / midX) * 10;

  card.style.transform = `
    rotateX(${-rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.05)
  `;
};

const resetCard = (card) => {
  card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
};

// 🔥 Skeleton Card
function ListingSkeletonCard() {
  return (
    <div className="listingCard skeletonCard">
      <div className="cardImageWrapper">
        <Skeleton height={220} borderRadius={12} />
      </div>

      <div className="cardContent">
        <h3 className="listingTitle">
          <Skeleton width="70%" height={25} />
        </h3>

        <p className="listingDescription">
          <Skeleton count={2} />
        </p>

        <div className="cardFooter">
          <div className="footer">
            <Skeleton width={120} />
            <Skeleton width={90} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔥 MAIN COMPONENT
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

  const listings =
    searchResults.length > 0 ? searchResults : fetchedListings;

  // ❌ Error State
  if (error && searchResults.length === 0) {
    return (
      <div className="error-state">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="allListingsContainer">
      {/* 🔥 Loading Skeleton */}
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
              <div
                className="listingCard"
                onMouseMove={(e) =>
                  handleMouseMove(e, e.currentTarget)
                }
                onMouseLeave={(e) =>
                  resetCard(e.currentTarget)
                }
              >
                {/* Image */}
                <div className="cardImageWrapper">
                  <img
                    src={listing.image?.[0]?.url}
                    alt={listing.title}
                    className="cardImage"
                  />
                  <div className="cardOverlay"></div>
                </div>

                {/* Content */}
                <div className="cardContent">
                  <h3 className="listingTitle">
                    {listing.title}
                  </h3>

                  <p className="listingDescription">
                    {listing.description}
                  </p>

                  <div className="cardFooter">
                    <div className="footer">
                      <span className="price">
                        ₹ {listing.price} / night
                      </span>
                      <span className="location">
                        {listing.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
}