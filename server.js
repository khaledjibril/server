import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

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
      "https://neriah-photography.vercel.app"
    ],
    credentials: true,
  })
);

// Handle uploads folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/complaints", complaintRoutes);

// Root endpoint
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "khaledblings@gmail.com",
      subject: "Render Test Email",
      html: "<h1>Hello from Render!</h1>",
    });
    res.send("Email sent!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Email failed: " + err.message);
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
