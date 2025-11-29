import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  createBooking,
  getUserBookings,
  getSingleBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create booking
router.post("/", verifyToken, createBooking);

// Get bookings for logged-in user
router.get("/user", verifyToken, getUserBookings);

// Get a single booking by ID
router.get("/:id", verifyToken, getSingleBooking);


export default router;
