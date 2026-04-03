import Groq from "groq-sdk";
import express from "express";
import { reviewSummary , generateDescription} from "../controllers/aiResponse.js";
const router = express.Router();    




router.post("/ReviewSummary/:id",reviewSummary)
router.post("/generateDescription",generateDescription)
export default router;

