import { Request, Response } from "express";
import User from "../models/User";

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    const users = await User.find();
    res.json(users);
};