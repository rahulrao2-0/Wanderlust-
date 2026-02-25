import { getAdminStats } from "../controllers/admin.js";
import express from "express";
const router = express.Router();

router.get("/stats", getAdminStats);

export default router;