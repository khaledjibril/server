import express from "express";
import { calculateTotalPrice } from "../utils/priceCalculator.js";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    const { size, frame, frameType } = req.body;

    const totalPrice = calculateTotalPrice({
      size,
      frame,
      frameType,
    });

    res.json({ totalPrice });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
