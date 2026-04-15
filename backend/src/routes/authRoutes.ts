import { Router } from "express";
import { register, login, approveUser, forgotPassword, resetPassword } from "../controllers/authController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// 🔐 Protected admin route
router.patch("/approve", protect, adminOnly, approveUser);

export default router;