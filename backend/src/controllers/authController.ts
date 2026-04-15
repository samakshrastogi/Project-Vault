import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (id: string) =>
    jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message:
                "Registration successful. Your profile is under approval. Admin has been notified.",
            userId: user._id,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.status !== "APPROVED") {
            return res
                .status(403)
                .json({ message: "Your account is not approved yet" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id.toString());

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = generateToken(user._id.toString());
        const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await User.findByIdAndUpdate(user._id, {
            resetToken,
            resetTokenExpiry,
        });

        // In a real app, send email here. For now, return the token for demo purposes
        return res.status(200).json({
            message: "Password reset token generated. In production, this would be sent via email.",
            resetToken, // Remove this in production
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const user = await User.findById(decoded.id).select("+resetToken +resetTokenExpiry");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if token is expired
        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ message: "Reset token has expired" });
        }

        // Check if token matches
        if (user.resetToken !== token) {
            return res.status(400).json({ message: "Invalid reset token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetToken: undefined,
            resetTokenExpiry: undefined,
        });

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error: any) {
        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Invalid token" });
        }
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

export const approveUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { status: "APPROVED" },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User approved successfully",
            user,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};