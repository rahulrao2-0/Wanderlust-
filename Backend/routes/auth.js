import express from "express";
import { signup, login, logout } from "../controllers/auth.js";
import { authMiddleware } from "../middleware/authValidate.js";
import {verifyEmail} from "../controllers/auth.js"
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email/:token", verifyEmail);


export default router;
