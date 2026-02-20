import "./HostAllListings.css";
import { useState } from "react";
import Button from "@mui/material/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function HostAllListings() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const fetchListings = async () => {
    const response = await fetch("http://localhost:5000/api/HostAllListings", {
      credentials: "include",
    });
    return response.json();
  };

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const deleteListing = async (listingId) => {
    const res = await fetch(
      `http://localhost:5000/api/delete/${listingId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Failed to delete listing");

    return res.json();
  };

  const mutation = useMutation({
    mutationFn: deleteListing,

    onMutate: async (listingId) => {
      setDeletingId(listingId); // ⭐ remember which one

      await queryClient.cancelQueries({ queryKey: ["listings"] });
      const previousListings = queryClient.getQueryData(["listings"]);

      queryClient.setQueryData(["listings"], (old) =>
        old?.filter((listing) => listing._id !== listingId)
      );

      return { previousListings };
    },

    onError: (err, listingId, context) => {
      queryClient.setQueryData(["listings"], context.previousListings);
      console.error(err);
    },

    onSettled: () => {
      setDeletingId(null); // ⭐ enable buttons again
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  if (isLoading) return <div className="loadingState">Loading listings...</div>;
  if (error) return <div className="errorState">Error: {error.message}</div>;

  return (
    <div className="hostListingsContainer">
      <div className="listingsGrid">
        {listings?.map((listing) => (
          <div key={listing._id} className="listingCard">
            <div className="cardImageWrapper">
              <img
                src={listing.image.url}
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
              <Button
                size="small"
                variant="outlined"
                sx={{ flex: 1 }}
              >
                Share
              </Button>
              <Button
                size="small"
                variant="outlined"
                sx={{ flex: 1 }}
              >
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
