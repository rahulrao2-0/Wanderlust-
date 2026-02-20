import ExpressError from "../ExpressError.js";
import Host from "../models/host.js";
import Listing from "../models/listing.js";
import Booking from "../models/booking.js";
import { startSession } from "mongoose";
import sendEmail from "../utils/sendEmails.js";
export const hostDetailsSave = async (req, res,next) => {
  try {
    // 🔑 logged-in user id (from JWT)
    const userId = req.user.id;

    // Optional: prevent duplicate host profiles
    const existingHost = await Host.findOne({ user: userId });
    if (existingHost) {
      return next(new ExpressError(400,"Host Profile already exists"))
    }

    // Create host profile
    const host = await Host.create({
      user: userId,              // 👈 THIS LINE IS THE KEY
      name: req.body.name,
      contactNo: req.body.contactNo,
      email: req.body.email,
      country: req.body.country,
      state: req.body.state,
      address: req.body.address,
    });
    // console.log(host)

    res.status(201).json({
      success: true,
      message: "Host profile created",
      host,
    });

  } catch (error) {
    console.error("Host create error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const yourListings = async(req,res,next) =>{
  
  //  console.log(req.user.id)
  const host =  await Host.findOne({user:req.user.id})
  const listings = await Listing.find({ owner: host._id });
  // console.log(listings)
  if(!listings){
    return next(new ExpressError(404,"Listings is not availble"))
  }
  res.status(200).json({
     "listings":listings
  })
}

export const deleteListing = async(req,res)=>{
  const {listingId} = req.params
  console.log(listingId)

  const listing = await Listing.deleteOne({_id:listingId})
  console.log(listing)

}

export const reservations = async(req,res)=>{
  const{hostId} = req.params
  console.log(hostId)

  const host = await Host.findOne({_id:hostId})

  const bookings = await Booking.find({ host: hostId })
  .populate(["user", "host", "listing"]);
  // console.log(bookings)

  
  res.status(200).json({
    bookings
  })

}

  export const confirmation = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("user listing");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // update first
    booking.status = status;
    await booking.save();

    // send email
    if (status === "confirmed") {
      await sendEmail({
        to: booking.user.email,
        subject: "Booking Confirmed 🎉",
        html: `
          <h2>Your booking is confirmed!</h2>

          <p><b>Listing:</b> ${booking.listing.title}</p>
          <p><b>Check In:</b> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p><b>Check Out:</b> ${new Date(booking.checkOut).toLocaleDateString()}</p>
          <p><b>Guests:</b> ${booking.guests}</p>
          <p><b>Total Price:</b> ₹${booking.totalPrice}</p>

          <br/>
          <p>Thank you for booking with us ❤️</p>
        `,
      });
    }
    if (status === "cancelled") {
      await sendEmail({
        to: booking.user.email,
        subject: "Booking cancelled",
        html: `
          <h2>Your booking is cancelled</h2>

          <p><b>Listing:</b> ${booking.listing.title}</p>
          <p><b>Check In:</b> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p><b>Check Out:</b> ${new Date(booking.checkOut).toLocaleDateString()}</p>
          <p><b>Guests:</b> ${booking.guests}</p>
          <p><b>Total Price:</b> ₹${booking.totalPrice}</p>

          <br/>
          
        `,
      });
    }

    res.status(200).json({ success: true, booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
