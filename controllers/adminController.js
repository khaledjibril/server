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

// POST /api/admin/gallery
export const uploadGalleryImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !filePath) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await saveGalleryImage(title, description, filePath);
    res.json({ message: "Gallery image uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload gallery image" });
  }
};
