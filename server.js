import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import authPassword from "./routes/authPassword.js";
import userRoutes from "./routes/userRolesRoutes.js";

// Load .env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS (allow local + production frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://neriah-photography.vercel.app",
      process.env.FRONTEND_URL // optional for env-based URL
    ],
    credentials: true,
  })
);
// psql "postgresql://photography_db_ps6v_user:O0QAh1hXFhwXaM7Uz6rCpVKyog8eIR3m@dpg-d4l14eu3jp1c7394e1ag-a.oregon-postgres.render.com:5432/photography_db_ps6v?sslmode=require"

// Handle uploads folder
const __dirname = path.resolve();
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/auth", authPassword);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
