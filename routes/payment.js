const express = require("express");
const Razorpay = require("razorpay");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/user");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create", auth, async (req, res) => {
  const { amount } = req.body; // INR
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    payment_capture: 1,
  });
  res.json({ orderId: order.id, keyId: process.env.RAZORPAY_KEY_ID });
});

// Webhook for payment success
router.post("/webhook", async (req, res) => {
  // Verify signature etc. for real implementation!
  const { payload } = req.body;
  const githubId = payload?.githubId;
  const credits = payload?.credits || 100;
  if (githubId) {
    await User.updateOne({ githubId }, { $inc: { credits } });
  }
  res.json({ status: "ok" });
});

module.exports = router;
