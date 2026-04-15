import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error(
    "Missing required environment variables: MONGO_URI and JWT_SECRET must be defined."
  );
  process.exit(1);
}

// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});