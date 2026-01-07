import express from "express";
import multer from "multer";
import {
  getStats,
  getRecentUsersController,
  getRecentOrdersController,
  addGalleryImage,
} from "../controllers/adminController.js";
import { fetchBookings } from "../controllers/bookingController.js";


const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get("/stats", getStats);
router.get("/recent-users", getRecentUsersController);
router.get("/recent-orders", getRecentOrdersController);
router.post("/gallery", upload.single("file"), addGalleryImage);



// ADMIN — get all bookings
router.get("/bookings", fetchBookings);

//USERS
router.get("/users", getRecentUsersController);


export default router;
