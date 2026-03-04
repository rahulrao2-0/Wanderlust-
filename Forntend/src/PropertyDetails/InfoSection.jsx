import { useContext, useState, useEffect } from "react";
import "./InfoSection.css";
import * as React from "react";
import MyContext from "../MyContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Map from "./Map";
import { Rating, TextField } from "@mui/material";
import Review from "./Review";

export default function InfoSection() {
  const navigate = useNavigate();
  const { property } = useContext(MyContext);
  const [checkInValue, setCheckInValue] = useState(null);
  const [checkOutValue, setCheckOutValue] = useState(null);
  const [guests, setGuests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [allReviews, setAllReviews] = useState([]);
  const [review, setReview] = useState("");
  const [isPostingReview, setIsPostingReview] = useState(false);

  // Mobile booking sheet state
  const [showMobileForm, setShowMobileForm] = useState(false);

  const userId = user?.user?._id;

  /* ── Reviews ── */
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/property/${property?._id}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setAllReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in to submit a review.");
      navigate("/login");
      return;
    }
    if (!rating || !review.trim()) {
      alert("Please provide a rating and a review comment.");
      return;
    }
    setIsPostingReview(true);
    try {
      const reviewData = { propertyId: property?._id, rating, comment: review };
      const response = await fetch(
        `http://localhost:5000/api/reviews/${userId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        }
      );
      const data = await response.json();
      if (data.message) {
        alert("Failed to submit review: " + data.message);
        return;
      }
      setRating(0);
      setReview("");
      await fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsPostingReview(false);
    }
  };

  useEffect(() => {
    if (property?._id) fetchReviews();
  }, [property?._id]);

  /* ── Booking ── */
  const handleChange = (e) => setGuests(e.target.value);

  const submitData = async () => {
    if (!checkInValue || !checkOutValue || !guests) {
      alert("Please fill all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const bookingData = {
        propertyId: property?._id,
        checkIn: checkInValue.format("MM-DD-YYYY"),
        checkOut: checkOutValue.format("MM-DD-YYYY"),
        guests,
      };
      const response = await fetch(
        `http://localhost:5000/api/booking/${user.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        }
      );
      const data = await response.json();
      if (data.error === "Dates not available") {
        alert("Booking failed: Choose another Dates");
        setCheckInValue(null);
        setCheckOutValue(null);
        setGuests("");
        return;
      } else if (data.error === "Please verify your email to book a property") {
        alert("Booking failed: " + data.error);
        navigate("/login");
        return;
      }
      if (data.success) {
        alert("Booking confirmed!");
        setCheckInValue(null);
        setCheckOutValue(null);
        setGuests("");
        setShowMobileForm(false);
      } else {
        alert("Booking failed: " + (data.message || "Please try again"));
        navigate("/login");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Connection error. Please check your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Shared date + guest form fields (used in both desktop card & mobile sheet) */
  const BookingFields = () => (
    <>
      <label>Check-In</label>
      <div className="check-In">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select date"
            value={checkInValue}
            onChange={(v) => setCheckInValue(v)}
          />
        </LocalizationProvider>
      </div>

      <label>Check-Out</label>
      <div className="check-out">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select date"
            value={checkOutValue}
            onChange={(v) => setCheckOutValue(v)}
            minDate={checkInValue}
          />
        </LocalizationProvider>
      </div>

      <label>Guests</label>
      <div className="guests">
        <FormControl sx={{ m: 0, minWidth: 120 }} size="small" fullWidth>
          <InputLabel id="guests-label">Guests</InputLabel>
          <Select
            labelId="guests-label"
            value={guests}
            label="Guests"
            onChange={handleChange}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={1}>One</MenuItem>
            <MenuItem value={2}>Two</MenuItem>
            <MenuItem value={3}>Three</MenuItem>
          </Select>
        </FormControl>
      </div>
    </>
  );

  return (
    <>
      {/* ── Property Info ── */}
      <div className="infoContainer">
        <div className="descriptionDiv">
          <div className="hostNameDiv">
            {property?.host ? (
              <>
                <span className="hostname">Host : {property.host.name}</span>
                <span>Experience : {property.host.experience}</span>
                <span>contact : {property.host.contact}</span>
              </>
            ) : (
              <span>Not available</span>
            )}
          </div>
          <hr />
          <div className="hotelDetails">
            {property?.hotelDetails ? (
              <>
                <span>Type: {property.hotelDetails.type}</span>
                <span>Rooms: {property.hotelDetails.rooms}</span>
                <span>Bathrooms: {property.hotelDetails.bathrooms}</span>
                <span>MaxGuests: {property.hotelDetails.maxGuests}</span>
              </>
            ) : (
              <p>Not available</p>
            )}
          </div>
          <hr />
          <div className="description">
            <p>{property?.description || "Good hotel"}</p>
          </div>
          <hr />
          <div className="amenities">
            <p>Amenities</p>
            {property?.amenities ? (
              property.amenities.map((item, i) => <span key={i}>{item}</span>)
            ) : (
              <span>Not Available</span>
            )}
          </div>
          <hr />
          <div className="hotelRules">
            <p>Hotel Rules</p>
            {property?.hotelRules ? (
              <>
                <span>Check-In: {property.hotelRules.checkIn}</span>
                <span>Check-Out: {property.hotelRules.checkOut}</span>
                <span>Pets Allowed: {property?.hotelRules?.petsAllowed ? "Yes" : "No"}</span>
                <span>Smoking Allowed: {property?.hotelRules?.smokingAllowed ? "Yes" : "No"}</span>
              </>
            ) : (
              <span>Not available</span>
            )}
          </div>
        </div>

        {/* ── Desktop reservation card ── */}
        <div className="check-inDiv">
          <div className="reservationDiv">
            <div className="price">
              <span>₹{property?.price || "Price not available"}/night</span>
            </div>
            <BookingFields />
            <Button
              variant="contained"
              color="error"
              className="reserveButton"
              onClick={submitData}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Reserving..." : "Reserve"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="mobileReserveBar">
        <div className="mobileReserveBar__price">
          <span className="priceAmount">
            ₹{property?.price || "—"}/night
          </span>
          <span className="priceLabel">Tap to check availability</span>
        </div>
        <button
          className="mobileReserveBar__btn"
          onClick={() => setShowMobileForm(true)}
          disabled={isSubmitting}
        >
          Reserve
        </button>
      </div>

      {/* ── Mobile slide-up booking form ── */}
      {showMobileForm && (
        <>
          <div
            className="mobileBookingOverlay"
            onClick={() => setShowMobileForm(false)}
          />
          <div className="mobileBookingForm">
            <div className="mobileBookingForm__header">
              <h4>₹{property?.price || "—"}/night</h4>
              <button
                className="mobileBookingForm__close"
                onClick={() => setShowMobileForm(false)}
              >
                ✕
              </button>
            </div>

            <BookingFields />

            <Button
              variant="contained"
              fullWidth
              className="mobileBookingForm__confirmBtn"
              onClick={submitData}
              disabled={isSubmitting}
              sx={{
                background: "linear-gradient(135deg, #e53935, #c62828)",
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                padding: "14px 0",
                boxShadow: "0 4px 14px rgba(229,57,53,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #c62828, #b71c1c)",
                },
              }}
            >
              {isSubmitting ? "Reserving..." : "Reserve"}
            </Button>
          </div>
        </>
      )}

      {/* ── Reviews ── */}
      <div className="ReviewDiv">
        <div className="Review">
          <h1>Reviews</h1>
          <div className="reviewScrollArea">
            <Review review={Array.isArray(allReviews) ? allReviews : []} />
          </div>
        </div>

        <div className="submitReviewDiv">
          <div className="reviewFormCard">
            <h3>Leave a Review</h3>
            <div className="ratingRow">
              <label>Your Rating</label>
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                sx={{
                  "& .MuiRating-iconFilled": { color: "#e53935" },
                  "& .MuiRating-iconHover": { color: "#c62828" },
                }}
              />
            </div>
            <TextField
              placeholder="Share your experience..."
              multiline
              rows={4}
              fullWidth
              value={review}
              onChange={(e) => setReview(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  "&.Mui-focused fieldset": { borderColor: "#e53935" },
                },
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={isPostingReview}
              sx={{
                background: isPostingReview
                  ? "#ccc"
                  : "linear-gradient(135deg, #e53935, #c62828)",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "10px 0",
                boxShadow: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #c62828, #b71c1c)",
                  boxShadow: "0 4px 14px rgba(229,57,53,0.35)",
                },
              }}
            >
              {isPostingReview ? "Posting..." : "Post Review"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Map ── */}
      <h2 className="propertylocation">Where you'll be</h2>
      <h3 className="propertylocation">
        {property?.location}, {property?.country}
      </h3>
      <div className="ReviewMapDiv">
        <div className="mapContainer">
          <Map coordinates={property?.geometry?.coordinates} />
        </div>
      </div>
    </>
  );
}