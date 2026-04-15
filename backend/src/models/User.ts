import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * 🔐 User Status & Role Types
 */
export type UserStatus = "PENDING" | "APPROVED";
export type UserRole = "USER" | "ADMIN";

/**
 * 📦 User Document Interface
 */
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    status: UserStatus;
    role: UserRole;
    resetToken?: string;
    resetTokenExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 🧱 User Schema
 */
const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false, // 🔐 hides password by default
        },

        status: {
            type: String,
            enum: ["PENDING", "APPROVED"],
            default: "PENDING",
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },

        // 🔑 For forgot password feature
        resetToken: {
            type: String,
        },

        resetTokenExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * 🔐 Remove sensitive fields from response
 */
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.resetToken;
    delete obj.resetTokenExpiry;
    return obj;
};

/**
 * 🧠 Prevent model overwrite in dev (important for hot reload)
 */
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;