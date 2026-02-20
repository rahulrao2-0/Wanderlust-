import express from "express";
import { createBooking } from "../controllers/booking.js";
import { authMiddleware } from "../middleware/authValidate.js";

const router = express.Router();

router.post("/booking/:name", authMiddleware, createBooking);

export default router;
