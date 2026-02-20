import express from "express";
import { authMiddleware } from "../middleware/authValidate.js";
import { hostDetailsSave,yourListings,deleteListing,reservations, confirmation } from "../controllers/host.js";

const router = express.Router();

router.post("/host", authMiddleware, hostDetailsSave);
router.get("/host/yourListings",authMiddleware,yourListings)
router.delete("/delete/:listingId",authMiddleware,deleteListing)
router.get("/reservations/:hostId",reservations )
router.patch("/reservations/:bookingId", confirmation)
export default router;
