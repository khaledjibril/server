import pool from "../config/db.js";

// =======================
// Auth & Password Reset
// =======================

// Create a new user
export const createUser = async ({ fullName, phone, email, password }) => {
  const query = `
    INSERT INTO users (full_name, phone, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name, email
  `;
  const values = [fullName, phone, email, password];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Find user by email
export const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

// Save reset code
export const saveResetCode = async (email, code, expires) => {
  const query = `
    UPDATE users
    SET reset_code = $1, reset_code_expires = $2
    WHERE email = $3
  `;
  await pool.query(query, [code, expires, email]);
};

// Verify reset code
export const verifyResetCode = async (email, code) => {
  const query = `
    SELECT * FROM users
    WHERE email = $1 AND reset_code = $2
  `;
  const { rows } = await pool.query(query, [email, code]);
  return rows[0];
};

export const updatePassword = async (email, hashedPassword) => {
  const query = `
    UPDATE users 
    SET password = $1, reset_code = NULL, reset_code_expires = NULL
    WHERE email = $2
  `;

  await pool.query(query, [hashedPassword, email]);
};


// =======================
// Dashboard / Admin Methods
// =======================

// Get total users
export const getTotalUsers = async () => {
  const res = await pool.query("SELECT COUNT(*) FROM users");
  return parseInt(res.rows[0].count);
};

// Get recent users (latest signups by highest ID)
export const getRecentUsers = async (limit = 5) => {
  const res = await pool.query(
    "SELECT id, full_name AS name, email, is_admin, created_at FROM users ORDER BY id DESC LIMIT $1",
    [limit]
  );
  return res.rows;
};
