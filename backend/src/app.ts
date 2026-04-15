import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import suggestionRoutes from "./routes/suggestionRoutes";


const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/suggestions", suggestionRoutes);





// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Project Vault API running 🚀");
});

export default app;