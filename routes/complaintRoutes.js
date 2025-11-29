import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  submitComplaint,
  fetchUserComplaints,
  fetchAllComplaints,
} from "../controllers/complaintController.js";

const router = express.Router();

// User submits complaint
router.post("/", verifyToken, submitComplaint);

// User views their complaints
router.get("/my", verifyToken, fetchUserComplaints);

// Admin views all complaints
router.get("/all", fetchAllComplaints);

export default router;
