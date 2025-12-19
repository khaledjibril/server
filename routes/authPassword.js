import express from "express";
import {
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authPassword.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.patch("/change-password", authenticate, changePassword);

export default router;