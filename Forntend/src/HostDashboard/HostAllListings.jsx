import "./HostAllListings.css";
import { useState } from "react";
import Button from "@mui/material/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../PropertyDetails/AuthContext";

export default function HostAllListings() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();
  console.log("Current User:", user); // Debugging line

  // ✅ Use a single queryKey variable
  const queryKey = ["hostListings", user?.user?._id];

  // 🔹 Fetch Host Listings
  const fetchListings = async () => {
    const response = await fetch("http://localhost:5000/api/HostAllListings", {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch listings");
    return response.json();
  };

  const { data: listings = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchListings,
    staleTime: 5 * 60 * 1000,
  });

  // 🔹 Delete Listing API
  const deleteListing = async (listingId) => {
    const res = await fetch(`http://localhost:5000/api/delete/${listingId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete listing");
    return res.json();
  };

  // 🔹 Mutation for deleting listing
  const mutation = useMutation({
    mutationFn: deleteListing,

    onMutate: async (listingId) => {
      setDeletingId(listingId);

      // Cancel any outgoing refetches (so they don't overwrite optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousListings = queryClient.getQueryData(queryKey);

      // Optimistically update the listings in the cache
      queryClient.setQueryData(queryKey, (old = []) =>
        old.filter((listing) => listing._id !== listingId)
      );

      return { previousListings };
    },

    onError: (err, listingId, context) => {
      // Rollback to previous state if delete fails
      if (context?.previousListings) {
        queryClient.setQueryData(queryKey, context.previousListings);
      }
      console.error(err);
    },

    onSettled: () => {
      setDeletingId(null);
      // Refetch to make sure UI is in sync with server
      queryClient.invalidateQueries({ queryKey });
    },
  });

  if (isLoading)
    return <div className="loadingState">Loading listings...</div>;

  if (error) return <div className="errorState">Error: {error.message}</div>;

  return (
    <div className="hostListingsContainer">
      <div className="listingsGrid">
        {listings.map((listing) => (
          <div key={listing._id} className="listingCard">
            <div className="cardImageWrapper">
              <img
                src={listing.image?.url}
                alt={listing.title}
                className="cardImage"
              />
              <div className="cardOverlay"></div>
            </div>

            <div className="cardContent">
              <h3 className="cardTitle">{listing.title}</h3>
              <p className="cardDescription">{listing.description}</p>
            </div>

            <div className="cardActions">
              <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                Share
              </Button>

              <Button size="small" variant="outlined" sx={{ flex: 1 }}>
                Learn More
              </Button>

              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => mutation.mutate(listing._id)}
                disabled={deletingId === listing._id}
                sx={{ flex: 1 }}
              >
                {deletingId === listing._id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}