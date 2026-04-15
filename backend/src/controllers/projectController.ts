import { Request, Response } from "express";
import Project from "../models/Project";

interface AuthRequest extends Request {
    user?: any;
}

// Get all projects (visible to all authenticated users)
export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const projects = await Project.find({}).populate('user', '_id name');
        res.status(200).json(projects);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a new project
export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const { name, category, visitLink } = req.body;

        if (!name || !category) {
            return res.status(400).json({ message: "Name and category are required" });
        }

        const project = await Project.create({
            name,
            category,
            visitLink,
            user: req.user._id,
            createdBy: req.user.name,
        });

        res.status(201).json(project);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a project (any authenticated user can edit)
export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, visitLink } = req.body;

        const project = await Project.findByIdAndUpdate(
            id,
            { name, category, visitLink },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(project);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a project (any authenticated user can delete)
export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};