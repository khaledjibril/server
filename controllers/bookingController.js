import pool from "../config/db.js";
import { getAllBookings } from "../models/bookingModel.js";


// =====================================
// 🟩 CREATE BOOKING
// =====================================
export const createBooking = async (req, res) => {
  const userId = req.user.id; // from JWT
  const {
    event_type,
    custom_event,
    start_date,
    end_date,
    start_time,
    end_time,
    country,
    state,
    address,
  } = req.body;

  if (!event_type || !start_date || !end_date || !country || !address) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Fetch user info from database
    const userResult = await pool.query(
      "SELECT full_name, email FROM users WHERE id = $1",
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = userResult.rows[0];

    const result = await pool.query(
      `
      INSERT INTO bookings 
      (
        full_name,
        email,
        event_type,
        custom_event,
        start_date,
        end_date,
        start_time,
        end_time,
        country,
        state,
        address,
        user_id
      )
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
      `,
      [
        user.full_name,
        user.email,
        event_type,
        custom_event,
        start_date,
        end_date,
        start_time,
        end_time,
        country,
        state,
        address,
        userId,
      ]
    );

    return res.status(201).json({
      message: "Booking created successfully",
      booking: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================================
// 🟦 GET ALL BOOKINGS FOR LOGGED-IN USER
// =====================================
export const getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================
// 🟧 GET A SINGLE BOOKING BY ID
// =====================================
export const getSingleBooking = async (req, res) => {
  const userId = req.user.id;
  const bookingId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [bookingId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const fetchBookings = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
};
