import pool from "../config/db.js";

import {
  getRecentUsers,
  getTotalUsers
} from "../models/userModel.js";

import {
  getRecentOrders,
  getTotalOrders
} from "../models/orderModel.js";

import { getTotalBookings } from "../models/bookingModel.js";
import { saveGalleryImage } from "../models/galleryModel.js";

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await getTotalUsers();
    const totalOrders = await getTotalOrders();
    const totalBookings = await getTotalBookings();

    res.json({ totalUsers, totalOrders, totalBookings});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// GET /api/admin/recent-users
export const getRecentUsersController = async (req, res) => {
  try {
    const users = await getRecentUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent users" });
  }
};

// GET /api/admin/recent-orders
export const getRecentOrdersController = async (req, res) => {
  try {
    const orders = await getRecentOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
};

export const addGalleryImage = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const query = `
      INSERT INTO gallery (title, description, image_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [
      title,
      description,
      imageUrl,
    ]);

    res.status(201).json({
      message: "Gallery image added successfully",
      image: rows[0],
    });
  } catch (err) {
    console.error("GALLERY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGalleryImages = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM gallery ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch gallery" });
  }
};
