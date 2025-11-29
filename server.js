import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import pool from "./config/db.js";
import path from "path";
import orderRoutes from "./routes/orderRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";




dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));


// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/complaints", complaintRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
