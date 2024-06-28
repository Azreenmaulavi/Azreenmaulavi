const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config(); 

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// Controller to create an order
exports.createOrder = async (req, res) => {
  const amount = req.body.amount; // Amount in paisa
  const currency = req.body.currency || "INR";

  const options = {
    amount: amount,
    currency: currency,
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.KEY_ID, // Send the key_id in the response
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};


// Controller to capture payment
exports.capturePayment = async (req, res) => {
    const paymentId = req.params.paymentId;
  
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      // Process the payment details as per your application logic
      res.json(payment);
    } catch (error) {
      console.error("Error capturing payment:", error);
      res.status(500).json({ error: "Failed to capture payment" });
    }
  };
  
