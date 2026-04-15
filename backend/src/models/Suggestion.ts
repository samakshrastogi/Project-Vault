import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * 💡 Suggestion Document Interface
 */
export interface ISuggestion extends Document {
    project: mongoose.Types.ObjectId;
    category: string;
    suggestion: string;
    user: mongoose.Types.ObjectId;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 🧱 Suggestion Schema
 */
const suggestionSchema = new Schema<ISuggestion>(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Project is required"],
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },

        suggestion: {
            type: String,
            required: [true, "Suggestion is required"],
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
 * 📚 Suggestion Model
 */
const Suggestion: Model<ISuggestion> = mongoose.model<ISuggestion>(
    "Suggestion",
    suggestionSchema
);

export default Suggestion;