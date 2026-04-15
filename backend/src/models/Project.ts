import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * 📦 Project Document Interface
 */
export interface IProject extends Document {
    name: string;
    category: string;
    visitLink: string;
    user: mongoose.Types.ObjectId;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 🧱 Project Schema
 */
const projectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },

        visitLink: {
            type: String,
            trim: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        createdBy: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * 🧠 Prevent model overwrite in dev (important for hot reload)
 */
const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;