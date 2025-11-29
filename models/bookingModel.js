import pool from "../config/db.js";

// Get total bookings
export const getTotalBookings = async () => {
  const res = await pool.query("SELECT COUNT(*) FROM bookings");
  return parseInt(res.rows[0].count);
};

// Get ALL bookings for admin
export const getAllBookings = async () => {
  const query = `
    SELECT 
      b.id,
      u.full_name AS customer_name,
      u.email AS customer_email,
      b.event_type,
      b.custom_event,
      b.start_date AS event_date,
      b.end_date,
      b.start_time,
      b.end_time,
      b.country,
      b.state AS event_state,
      b.address,
      b.created_at
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    ORDER BY b.created_at DESC
  `;
  
  const res = await pool.query(query);
  return res.rows;
};
