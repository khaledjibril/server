import express from "express";
import {signup, 
    signin,
  forgotPassword,
  verifyCode,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyCode);
router.post("/reset-password", resetPassword);

export default router;
