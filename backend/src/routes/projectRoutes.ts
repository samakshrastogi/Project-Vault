import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../controllers/projectController";

const router = Router();

// All routes require authentication
router.use(protect);

router.get("/", getProjects);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;