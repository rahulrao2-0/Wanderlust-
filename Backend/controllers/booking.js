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
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
            <h2 style="color: #4F46E5;">WanderLust 🌍</h2>
            <p>Hi <strong>${userFind.name}</strong>, your booking is confirmed!</p>

            <div style="background: #f4f4f4; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h3 style="margin-top: 0;">Booking Details</h3>
              <p>🏠 <strong>Property:</strong> ${listing.title}</p>
              <p>📅 <strong>Check-In:</strong> ${new Date(booking.checkIn).toDateString()}</p>
              <p>📅 <strong>Check-Out:</strong> ${new Date(booking.checkOut).toDateString()}</p>
              <p>🌙 <strong>Nights:</strong> ${nights}</p>
              <p>💰 <strong>Total Price:</strong> ₹${totalPrice}</p>
            </div>

            <div style="background: #eef2ff; padding: 16px; border-radius: 8px;">
              <h3 style="margin-top: 0;">Host Details</h3>
              <p>👤 <strong>Name:</strong> ${listing.owner.name}</p>
              <p>📧 <strong>Email:</strong> ${listing.owner.email}</p>
            </div>

            <p style="margin-top: 16px; color: #888;">Please wait for confirmation — you will receive a confirmation email from your host shortly.</p>
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