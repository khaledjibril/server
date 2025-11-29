import pool from "../config/db.js";

export const createComplaint = async (userId, complaint) => {
  const query = `
        INSERT INTO complaints (user_id, complaint)
        VALUES ($1, $2)
        RETURNING *
    `;
  const values = [userId, complaint];
  const res = await pool.query(query, values);
  return res.rows[0];
};

export const getUserComplaints = async (userId) => {
  const query = `
        SELECT * FROM complaints 
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
  const res = await pool.query(query, [userId]);
  return res.rows;
};

export const getAllComplaints = async () => {
  const query = `
        SELECT 
            c.id,
            u.full_name,
            u.email,
            c.complaint,
            c.status,
            c.created_at
        FROM complaints c
        JOIN users u ON u.id = c.user_id
        ORDER BY c.created_at DESC
    `;
  const res = await pool.query(query);
  return res.rows;
};


export const getPendingComplaints = async () => {
  const res = await pool.query("SELECT COUNT(*) FROM complaints WHERE status='pending'");
  return parseInt(res.rows[0].count);
};
