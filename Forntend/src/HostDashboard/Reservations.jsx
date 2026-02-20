import { useState, useEffect } from "react";
import { useAuth } from "../PropertyDetails/AuthContext";
import "./Reservations.css";

export default function Reservations() {
  const { user } = useAuth();
  const hostId = user?.host?._id;

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hostId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:5000/api/reservations/${hostId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch reservations");

        const data = await res.json();
        setReservations(data?.bookings || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hostId]);

  // ⭐ update booking status
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      // update UI without refresh
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="reservations-wrapper">
      <h2 className="page-title">Reservations</h2>
      <div className="allcards">
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        
        reservations.map((r) => (
          <div key={r._id} className="reservation-card-new">
            
            {/* IMAGE */}
            <img
              src={r.listing?.image?.url}
              alt={r.listing?.title}
              className="listing-image"
            />

            {/* CENTER INFO */}
            <div className="info">
              <h3>{r.listing?.title}</h3>
              <p className="location">{r.listing?.location}</p>

              <p><b>Guest:</b> {r.user?.name}</p>
              <p className="email">{r.user?.email}</p>

              <p>
                <b>Stay:</b>{" "}
                {new Date(r.checkIn).toLocaleDateString()} →{" "}
                {new Date(r.checkOut).toLocaleDateString()}
              </p>

              <p><b>Guests:</b> {r.guests}</p>
            </div>

            {/* RIGHT SIDE */}
            <div className="right">
              <h2 className="price">₹ {r.totalPrice}</h2>

              <span className={`status ${r.status}`}>{r.status}</span>

              {r.status === "pending" && (
                <div className="actions">
                  <button
                    className="confirm"
                    onClick={() => updateStatus(r._id, "confirmed")}
                  >
                    Confirm
                  </button>

                  <button
                    className="reject"
                    onClick={() => updateStatus(r._id, "cancelled")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>

          </div>
        
        ))
        
      )}
      </div>
    </div>
  );
}
