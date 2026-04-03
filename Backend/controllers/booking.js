import Listing from "../models/listing.js";
import Booking from "../models/booking.js";
import ExpressError from "../ExpressError.js";
import sendEmail from "../utils/sendEmails.js";
import User from "../models/user.js";


export const createBooking = async (req, res, next) => {
  try {
    const BookingUser = req.user;
    console.log(BookingUser);
    const user = await User.findById(BookingUser.id);
    if (!user.isVerified) {
      return next(new ExpressError(401, "Please verify your email to book a property"));
    }

    const { propertyId } = req.body;
    console.log(req.body);
    const userId = req.user.id;
    const checkInDate = new Date(req.body.checkIn);
    const checkOutDate = new Date(req.body.checkOut);

    const diffTime = checkOutDate - checkInDate;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const listing = await Listing.findById(propertyId).populate("owner");
    console.log(listing);

    console.log("owner id ", listing.owner._id);
    

    const totalPrice = nights * listing.price;
    console.log(totalPrice);

    const conflict = await Booking.findOne({
      listing: propertyId,
      status: { $ne: "cancelled" },
      checkIn: { $lt: req.body.checkOut },
      checkOut: { $gt: req.body.checkIn }
    });

    if (conflict) {
      return next(new ExpressError(409, "Dates not available"));
    }

    const booking = new Booking({
      user: userId,
      listing: listing._id,
      host: listing.owner._id,
      totalPrice: totalPrice,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      guests: req.body.guests
    });

    const result = await booking.save();
    console.log(result);

    const userFind = await User.findById(userId);
    const email = userFind.email;
    console.log(userFind);

    if (result) {
      await sendEmail({
        to: email,
        subject: "Booking Confirmed - WanderLust 🎉",
        html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f9fafb; padding: 30px;">
  
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4F46E5, #6366F1); color:white; padding:20px;">
      <h2 style="margin:0;">🌍 WanderLust</h2>
      <p style="margin:5px 0 0; opacity:0.9;">Booking Confirmation</p>
    </div>

    <!-- Body -->
    <div style="padding:24px;">
      
      <p style="font-size:16px;">Hi <strong>${userFind.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">Your booking request has been successfully submitted 🎉</p>

      <!-- Booking Card -->
      <div style="background:#f3f4f6; padding:18px; border-radius:10px; margin:20px 0;">
        <h3 style="margin-top:0; color:#111;">🏠 Booking Details</h3>
        <p><strong>Property:</strong> ${listing.title}</p>
        <p><strong>Check-In:</strong> ${new Date(booking.checkIn).toDateString()}</p>
        <p><strong>Check-Out:</strong> ${new Date(booking.checkOut).toDateString()}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p style="font-size:16px;"><strong>Total Price:</strong> ₹${totalPrice}</p>
      </div>

      <!-- Host Card -->
      <div style="background:#eef2ff; padding:18px; border-radius:10px;">
        <h3 style="margin-top:0; color:#111;">👤 Host Details</h3>
        <p><strong>Name:</strong> ${listing.owner.name}</p>
        <p><strong>Email:</strong> ${listing.owner.email}</p>
      </div>

      <!-- Highlight Message -->
      <div style="
        margin-top:20px;
        padding:14px;
        border-radius:8px;
        background:#fff7ed;
        border-left:5px solid #f97316;
        color:#9a3412;
        font-weight:500;
      ">
        ⏳ Please wait for confirmation — you will receive a confirmation email from your host shortly.
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6; padding:16px; text-align:center; font-size:13px; color:#777;">
      © ${new Date().getFullYear()} WanderLust. All rights reserved.
    </div>

  </div>
</div>
`
      });
    }

   
    res.status(200).json({
      success: true,
      message: "Booking successful",
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