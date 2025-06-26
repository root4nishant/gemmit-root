const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (amountInRupees) => {
  const options = {
    amount: amountInRupees * 100, 
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };
  return await razorpay.orders.create(options);
};
