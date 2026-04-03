// routes/paymentRoutes.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/booking.js";
import Listing from "../models/listing.js";
import User from "../models/user.js";
import sendEmail from "../utils/sendEmails.js";
import { getIO } from "../socket.js";
import Notification from "../models/notifications.js";
const router = express.Router();

const rzp = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────────────────────
// STEP 1 — Create Razorpay order
// POST /api/payment/create-order
// ─────────────────────────────────────────────────────────────
router.post("/create-order", async (req, res) => {
  try {
    const { amount, propertyId, checkIn, checkOut } = req.body;

    // Early date conflict check (before charging)
    const conflict = await Booking.findOne({
      listing:  propertyId,
      status:   { $ne: "cancelled" },
      checkIn:  { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    if (conflict) {
      return res.status(409).json({ error: "Dates not available" });
    }

    const order = await rzp.orders.create({
      amount:   Math.round(amount * 100), // paise
      currency: "INR",
      receipt:  `wanderlust_${Date.now()}`,
    });

    res.status(200).json(order);
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// ─────────────────────────────────────────────────────────────
// STEP 2 — Verify payment + create booking + send email
// POST /api/payment/verify-and-book
// ─────────────────────────────────────────────────────────────
router.post("/verify-and-book", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      propertyId,
      checkIn,
      checkOut,
      guests,
      userId,
    } = req.body;
 
    // 1. Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
 
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Please contact support.",
      });
    }
 
    // 2. Check user exists and is verified
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
      });
    }
 
    // 3. Final date conflict check (race condition guard)
    const conflict = await Booking.findOne({
      listing:  propertyId,
      status:   { $nin: ["cancelled", "rejected", "pending"] },
      checkIn:  { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });
 
    if (conflict) {
      console.error(`DATE CONFLICT AFTER PAYMENT — needs refund: ${razorpay_payment_id}`);
      return res.status(409).json({
        success: false,
        message: "These dates were just booked by someone else. You will receive a full refund in 5-7 business days.",
        paymentId: razorpay_payment_id,
      });
    }
 
    // 4. Get listing with owner details
    const listing = await Listing.findById(propertyId).populate("owner");
    if (!listing) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    const hostId = listing.owner._id.toString();
 
    const diffTime   = new Date(checkOut) - new Date(checkIn);
    const nights     = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;
 
    // 5. Save booking as PENDING — host must confirm manually
    const booking = new Booking({
      user:              userId,
      listing:           listing._id,
      host:              listing.owner._id,
      totalPrice,
      checkIn,
      checkOut,
      guests,
      status:            "pending",       // ← pending until host confirms
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });
 
    await booking.save();
 
    // 6. Send "payment received, waiting for host" email to guest
    await sendEmail({
      to: user.email,
      subject: "Payment Received - Awaiting Host Confirmation 🕐 - WanderLust",
      html: `
<div style="font-family:'Segoe UI',Arial,sans-serif;background:#f9fafb;padding:30px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
 
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4F46E5,#6366F1);color:white;padding:20px;">
      <h2 style="margin:0;">🌍 WanderLust</h2>
      <p style="margin:5px 0 0;opacity:0.9;">Payment Received — Pending Host Confirmation</p>
    </div>
 
    <!-- Body -->
    <div style="padding:24px;">
      <p style="font-size:16px;">Hi <strong>${user.name}</strong>,</p>
      <p style="font-size:15px;color:#555;">
        Your payment of <strong>₹${totalPrice}</strong> has been received successfully. 
        Your booking is now waiting for the host to confirm.
      </p>
 
      <!-- Booking Details -->
      <div style="background:#f3f4f6;padding:18px;border-radius:10px;margin:20px 0;">
        <h3 style="margin-top:0;color:#111;">🏠 Booking Details</h3>
        <p><strong>Property:</strong> ${listing.title}</p>
        <p><strong>Check-In:</strong> ${new Date(checkIn).toDateString()}</p>
        <p><strong>Check-Out:</strong> ${new Date(checkOut).toDateString()}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p style="font-size:16px;"><strong>Total Paid:</strong> ₹${totalPrice}</p>
        <p style="color:#888;font-size:13px;">Payment ID: ${razorpay_payment_id}</p>
      </div>
 
      <!-- Host Details -->
      <div style="background:#eef2ff;padding:18px;border-radius:10px;">
        <h3 style="margin-top:0;color:#111;">👤 Host Details</h3>
        <p><strong>Name:</strong> ${listing.owner.name}</p>
        <p><strong>Email:</strong> ${listing.owner.email}</p>
      </div>
 
      <!-- Pending Warning -->
      <div style="margin-top:20px;padding:14px;border-radius:8px;background:#fff7ed;border-left:5px solid #f97316;color:#9a3412;font-weight:500;">
        ⏳ Your booking is <strong>pending host approval</strong>. You will receive another email once the host confirms or rejects your booking.
        <br/><br/>
        If rejected, a <strong>full refund</strong> will be processed to your original payment method within 5-7 business days.
      </div>
    </div>
 
    <!-- Footer -->
    <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:13px;color:#777;">
      © ${new Date().getFullYear()} WanderLust. All rights reserved.
    </div>
 
  </div>
</div>`,
    });

    const notification = await Notification.create({
       host: hostId,   // receiver
       sender: user.id, // sender
      type: "booking",
      message: `New booking received for ${listing.title}`,
      bookingId: booking._id,
    });


    const io = getIO();
    
        console.log("Emitting to room:", hostId);
        io.to(hostId).emit("new-booking", {
          message: "New reservation received!",
          booking: booking,
        });
 
    res.status(200).json({
      success:   true,
      message:   "Payment received! Waiting for host confirmation.",
      bookingId: booking._id,
    });
 
  } catch (err) {
    console.error("verify-and-book error:", err);
    res.status(500).json({ success: false, message: "Booking failed after payment" });
  }
});
 
export default router;