import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const options = {
    amount: 19900,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

router.post("/verify", async (req, res) => {
  const { order_id, payment_id, signature, userId } = req.body;

  const isValid =
    signature ===
    crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + payment_id)
      .digest("hex");

  if (isValid) {
    await User.findByIdAndUpdate(userId, { isPaid: true });
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid payment" });
  }
});

export default router;
