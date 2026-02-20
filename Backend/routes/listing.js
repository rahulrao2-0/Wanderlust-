import express from "express";
import { allListings, singleListing ,HostAllListings} from "../controllers/listing.js";
import { authMiddleware } from "../middleware/authValidate.js";
const router = express.Router();

router.get("/listings", allListings);
router.get("/properties/:propertyId", singleListing);
router.get("/HostAllListings",authMiddleware,HostAllListings)

export default router;
