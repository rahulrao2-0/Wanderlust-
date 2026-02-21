import { useContext, useState  , useEffect} from "react";
import "./InfoSection.css"
import * as React from 'react';
import MyContext from "../MyContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker  } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Map from "./Map";
import Review from "./Review";



export default function InfoSection() {
  const navigate = useNavigate();
    const { property } = useContext(MyContext);
    const [propertyDescription, setPropertyDescription] = useState("");
    const [checkInValue, setCheckInValue] = useState(null);
    const [checkOutValue, setCheckOutValue] = useState(null);
    const [guests, setGuests] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
    const{user , setUser}= useAuth();
    console.log(property)
    console.log(property.hotelDetails)

    useEffect(() => {
        if (property && property.description) {
          setPropertyDescription(property.description);
        }
    }, [property]);

    const handleChange = (event) => {
      setGuests(event.target.value);
    };
    
    const submitData = async () => {
      // Validation
      if (!checkInValue || !checkOutValue || !guests) {
        alert("Please fill all fields");
        return;
      }

      setIsSubmitting(true); // Start loading

      try {
        const bookingData = {
          propertyId: property?._id,
          checkIn: checkInValue.format('MM-DD-YYYY'), // Format the date
          checkOut: checkOutValue.format('MM-DD-YYYY'),
          guests: guests,
        };

        console.log("Sending:", bookingData);

        const response = await fetch(`http://localhost:5000/api/booking/${user.id}`, {
          method: "POST",
          credentials:"include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();
        console.log(data);
        if(data.error==="Dates not available"){
        alert("Booking failed: " + (data.error || "Choose another Dates"));
        setCheckInValue(null);
        setCheckOutValue(null);
        setGuests("");
        return;
       }
        if (data.success) {
         console.log("Success:", data);
        alert("Booking confirmed!");

        // Reset form
        setCheckInValue(null);
        setCheckOutValue(null);
        setGuests("");
       }
       
       else {
       console.error("Error:", data);
       alert("Booking failed: " + (data.message || "Please try again"));
       navigate("/login")
       }
      } catch (err) {
        console.error("Network error:", err);
        alert("Connection error. Please check your internet and try again.");
      } finally {
        setIsSubmitting(false); // Stop loading
      }
    };

    return (
      <>
      <div className="infoContainer">
        <div className="descriptionDiv">
          <div className="hostNameDiv">
            {property?.host?(
             <>
             <span className="hostname">Host : {property.host.name}</span>
             <span>Experience : {property.host.experience}</span>
             <span>contact : {property.host.contact}</span>
            </>):(<>
            <span>Not available</span>
            </>)}
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
            {property?.amenities? (
              <>
              {property.amenities.map((item,index)=>(
                <span key={index}>{item}</span>
              ))}

              </>):(
                <>
                <span>Not Availabe</span>
              </>)}
          </div>
          <hr />
          <div className="hotelRules">
            <p>Hotel Rules</p>
            {property?.hotelRules? (
              <>
              <span>Check-In :{property.hotelRules.checkIn}</span>
              <span>Check-Out :{property.hotelRules.checkOut}</span><br />
              <span>PetsAllowed: {property?.hotelRules?.petsAllowed? (<><span>Yes</span></>):(<><span>No</span></>)}</span>
              <span>SmokingAllowed: {property?.hotelRules?.smokingAllowed? (<><span>Yes</span></>):(<><span>No</span></>)}</span>
              </>):(
                <>
                <span>Not avilable</span>
                </>)}
          </div>
        </div>

        <div className="check-inDiv">
          <div className="reservationDiv">
            <div className="price">
              <span>₹{property?.price || "Price not available"}/night</span>
            </div>
            
            <label htmlFor="check-in">Check-In</label>
            <div className="check-In">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select date"
                  value={checkInValue}
                  onChange={(newValue) => setCheckInValue(newValue)}
                />
              </LocalizationProvider>
            </div>
            
            <label htmlFor="check-out">Check-Out</label>
            <div className="check-out" id="check-out">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select date"
                  value={checkOutValue}
                  onChange={(newValue) => setCheckOutValue(newValue)}
                  minDate={checkInValue} // Prevent selecting checkout before checkin
                />
              </LocalizationProvider>
            </div>
            
            <label htmlFor="guests">Guests</label>
            <div className="guests">
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Guests</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={guests}
                  label="Guests"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>One</MenuItem>
                  <MenuItem value={2}>Two</MenuItem>
                  <MenuItem value={3}>Three</MenuItem>
                </Select>
              </FormControl>
            </div>
            
            <Button 
              variant="contained" 
              color="error" 
              className="reserveButton" 
              onClick={submitData}
              disabled={isSubmitting} // Disable while submitting
            >
              {isSubmitting ? "Reserving..." : "Reserve"}
            </Button>
          </div>
        </div>
      </div><br /><br />
      <h2 className="propertylocation">Where you'll be</h2>
      <h3 className="propertylocation">{property?.location},{property?.country}</h3>
      <div className="ReviewMapDiv">
     <div className="mapContainer">
      
      <Map coordinates={property?.geometry?.coordinates} />
    </div>

    <div className="reviewContainer">
      <Review />
     </div>
   </div>
      </>
     
    
    );
}