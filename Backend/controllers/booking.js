

import Listing from "../models/listing.js";
import Booking from "../models/booking.js";
import ExpressError from "../ExpressError.js";
import sendEmail from "../utils/sendEmails.js";
import User from "../models/user.js";

export const createBooking = async (req, res,next) => {
  try {
    const{propertyId} = req.body
    console.log(req.body)
    const userId = req.user.id; 
    const checkInDate = new Date(req.body.checkIn);
    const checkOutDate = new Date(req.body.checkOut);

// milliseconds difference
   const diffTime = checkOutDate - checkInDate;

// nights (ceil is important)
   const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const listing = await Listing.findById(propertyId).populate("owner");

    console.log(listing);

    const totalPrice= nights*listing.price
    console.log(totalPrice)
    const conflict = await Booking.findOne({
    listing: propertyId,
    status: { $ne: "cancelled" },
    checkIn: { $lt: req.body.checkOut },
    checkOut: { $gt: req.body.checkIn }
   });
  //  console.log(conflict)

    if (conflict) {
        return next(new ExpressError(409, "Dates not available"));
    }

    const booking = new Booking({
      user:userId,
      listing:listing._id,
      host:listing.owner._id,
      totalPrice:totalPrice,
      checkIn:req.body.checkIn,
      checkOut:req.body.checkOut,
      guests:req.body.guests
    })

    const result = await booking.save();
    console.log(result)
    const id = req.user.id
    const userFind = await User.findById(id)
    const email = userFind.email
    console.log(userFind)
    if(result){
      await sendEmail({
            to: email,
            subject: "Booking Confirmed",
            html: `
              <h2>WanderLust</h2>
              <p>Thanks for Booking on Wanderlust:</p>
              <p>Details</p>
              <p>Booking Check-In Date :${booking.checkIn}</p>
              <p>Booking Check-Out Date :${booking.checkOut}</p>
              <p>Total Price :${totalPrice}</p>
              <p>Host name :${listing.owner.name}</p>
              <p>Host Email :${listing.owner.email}</p>

              <h2> Please wait for confirmation You will recive a confirmation mail form host <h2/>
            `
          });
    }




    res.status(200).json({
      success: true,
      message: "Booking successful",
      // bookedBy: name,
      userId,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};
