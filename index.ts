import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes"; // ✅ User routes
import jobRoutes from "./routes/jobRoutes";  // ✅ Job routes

dotenv.config();
console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);
console.log("Database URL:", process.env.DATABASE_URL);
console.log("JWT Secret:", process.env.JWT_SECRET);
console.log("Server Port:", process.env.PORT);
const app = express();

// Debugging: Enable CORS for specific origin
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Parses JSON body

// Debugging: Ensure environment variables are loaded
console.log("🔹 JWT_SECRET Loaded:", process.env.JWT_SECRET ? "Yes" : "No");

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes); // Register the user routes
// Default route for health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
