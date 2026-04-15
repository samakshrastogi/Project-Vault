import express from "express";
import { getSuggestions, createSuggestion, deleteSuggestion } from "../controllers/suggestionController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all suggestions (admin only)
router.get("/", getSuggestions);

// Create a new suggestion
router.post("/", createSuggestion);

// Delete a suggestion (admin only)
router.delete("/:id", deleteSuggestion);

export default router;