const express = require('express');
const router = express.Router();
const { createOrder, capturePayment } = require('../Controllers/PaymentController');

// Route to create an order
router.post('/createOrder', createOrder);

// Route to capture a payment
router.post('/capturePayment/:paymentId', capturePayment);

module.exports = router;