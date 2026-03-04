import express from "express";
import { getReviewsForListing , createReview } from "../controllers/review.js";
import { authMiddleware } from "../middleware/authValidate.js";

const router = express.Router();

router.post("/reviews/:userId", authMiddleware,createReview);
router.get("/reviews/property/:propertyId", authMiddleware, getReviewsForListing);

export default router;