// components/YourListings/YourListings.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./YourListings.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchlistings = async () => {
  const res = await fetch(
    "http://localhost:5000/api/host/yourListings",
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch listings");

  const result = await res.json();
  return result.listings;
};

export default function YourListings() {
  const queryClient = useQueryClient();

  const {
    data: yourListings = [],   // ⭐ prevent undefined
    isLoading,
    error,
  } = useQuery({
    queryKey: ["yourListings"],
    queryFn: fetchlistings,
    staleTime: 0,              // ⭐ always consider old
    refetchOnWindowFocus: true,
  });

  // ⭐ Optional: auto sync whenever component mounts
  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["yourListings"] });
  }, [queryClient]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading listings</p>;

  return (
    <Box className="your-listings">
      <Box className="listings-header">
        <Typography variant="h6" className="section-title">
          Your Listings
        </Typography>

        <Box className="view-all-link">
          <Typography variant="body2" className="link-text">
            View All Listings
          </Typography>
          <ChevronRightIcon className="chevron-icon" />
        </Box>
      </Box>

      <Box className="listings-grid">
        {yourListings.map((listing) => (
          <Card key={listing._id} className="listing-card">
            <CardMedia
              component="img"
              height="180"
              image={listing?.image?.url}
              alt={listing.title}
              className="listing-image"
            />

            <CardContent className="listing-content">
              <Typography variant="h6" className="listing-title">
                {listing.title}
              </Typography>

              <Typography variant="body2" className="listing-location">
                {listing.location}
              </Typography>

              <Box className="listing-footer">
                <Typography variant="body2" className="price-text">
                  <span className="price-amount">${listing.price}</span>/night
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
