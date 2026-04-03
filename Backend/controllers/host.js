import ExpressError from "../ExpressError.js";
import Host from "../models/host.js";
import Listing from "../models/listing.js";
import Booking from "../models/booking.js";
import { startSession } from "mongoose";
import sendEmail from "../utils/sendEmails.js";
import User from "../models/user.js";
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

    const user = await User.findByIdAndUpdate(
     userId,
    {    $addToSet: { role: "host" } }, // adds only if not already exists
    { new: true }
   );

    console.log(user)
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
<div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f9fafb; padding: 20px;">
  
  <div style="max-width:500px; margin:auto; background:#ffffff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#4F46E5; color:white; padding:16px; text-align:center;">
      <h2 style="margin:0;">🎉 Booking Confirmed</h2>
    </div>

    <!-- Body -->
    <div style="padding:20px;">
      
      <p style="font-size:15px; color:#444;">Your booking has been successfully placed.</p>

      <!-- Booking Info -->
      <div style="background:#f3f4f6; padding:15px; border-radius:8px; margin:15px 0;">
        <p><strong>🏠 Listing:</strong> ${booking.listing.title}</p>
        <p><strong>📅 Check In:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
        <p><strong>📅 Check Out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
        <p><strong>👥 Guests:</strong> ${booking.guests}</p>
        <p style="font-size:16px;"><strong>💰 Total Price:</strong> ₹${booking.totalPrice}</p>
      </div>

      <!-- Highlight Message -->
      <div style="
        background:#ecfeff;
        border-left:5px solid #06b6d4;
        padding:12px;
        border-radius:6px;
        color:#0e7490;
        font-weight:500;
      ">
        We recommend contacting your host to coordinate check-in details and ask any questions you may have.  
      </div>

      <p style="margin-top:15px; color:#555;">Thank you for booking with us ❤️</p>

    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6; text-align:center; padding:10px; font-size:12px; color:#777;">
      © ${new Date().getFullYear()} WanderLust
    </div>

  </div>
</div>
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

export const earnings = async(req,res,next)=>{
    try{
      const host = await Host.findOne({user:req.user.id})
      // console.log("host", host);

        const booking = await Booking.find({host:host._id,status:"confirmed"});

        const currentMonth = new Date().getMonth();

       const monthlyBookings = booking.filter(b => {
        return new Date(b.createdAt).getMonth() === currentMonth;
       });
       console.log("monthlyBooking",monthlyBookings)
       const monthlyEarning = monthlyBookings.reduce((sum,b) => sum + b.totalPrice,0);
       const monthlyBookingsCount = monthlyBookings.length;
       console.log("monthlyEarning", monthlyEarning)
         
        // console.log(req.user.id)
        // console.log("booking", booking);
        const totalBooking = booking.length;
        const totalEarnings = booking.reduce((sum,b) => sum + b.totalPrice,0);
        res.status(200).json({totalEarnings, totalBooking ,monthlyBookings , monthlyEarning, monthlyBookingsCount});

    }catch(err){
        next(new ExpressError(500,"Failed to fetch earnings data"))
    }

}