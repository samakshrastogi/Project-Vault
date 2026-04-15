import { Request, Response } from "express";
import Suggestion from "../models/Suggestion";
import Project from "../models/Project";

interface AuthRequest extends Request {
    user?: any;
}

// Get all suggestions (admin only)
export const getSuggestions = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied" });
        }

        const suggestions = await Suggestion.find({})
            .populate('project', 'name category')
            .populate('user', '_id name')
            .sort({ createdAt: -1 });

        res.status(200).json(suggestions);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a new suggestion
export const createSuggestion = async (req: AuthRequest, res: Response) => {
    try {
        const { project, category, suggestion } = req.body;

        if (!project || !category || !suggestion) {
            return res.status(400).json({ message: "Project, category, and suggestion are required" });
        }

        // Verify the project exists and category matches
        const projectDoc = await Project.findById(project);
        if (!projectDoc) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (projectDoc.category !== category) {
            return res.status(400).json({ message: "Category does not match the selected project" });
        }

        const newSuggestion = await Suggestion.create({
            project,
            category,
            suggestion,
            user: req.user._id,
            createdBy: req.user.name,
        });

        res.status(201).json(newSuggestion);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a suggestion (admin only)
export const deleteSuggestion = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { id } = req.params;
        await Suggestion.findByIdAndDelete(id);
        res.status(200).json({ message: "Suggestion deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};