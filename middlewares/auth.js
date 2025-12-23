import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const router = express.Router();

// =======================
// 🔐 JWT SECRET
// =======================
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// =======================
// 🟦 SIGNUP
// =======================
router.post("/signup", async (req, res) => {
  const { fullName, phone, email, password } = req.body;

  if (!fullName || !phone || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (full_name, phone, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, phone`,
      [fullName, phone, email, hashedPassword]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// =======================
// 🟩 LOGIN
// =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  try {
    // Check if user exists
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// =======================
// 🛡 JWT AUTH MIDDLEWARE
// =======================
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token?
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid or expired token" });

    // Attach decoded user
    req.user = decoded;
    next();
  });
}