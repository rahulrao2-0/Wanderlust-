import express from "express";
import { getLatestNotifications , markAllNotificationsRead} from "../controllers/notification.js";
import { authMiddleware } from "../middleware/authValidate.js";

const router = express.Router();

router.get("/notifications/latest", authMiddleware, getLatestNotifications);
router.patch("/notifications/read-all", authMiddleware, markAllNotificationsRead);

export default router;