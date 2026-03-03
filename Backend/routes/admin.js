import { getAdminStats } from "../controllers/admin.js";
import express from "express";
import { authMiddleware } from "../middleware/authValidate.js";
import { adminMiddleware } from "../middleware/authValidate.js";
const router = express.Router();

router.get("/stats",authMiddleware,adminMiddleware, getAdminStats);

export default router;