const express = require('express');
const {adminsignin,adminsignup,fetchAdminDetails,verifyOTP} = require('../../Controllers/admin/admin');
const { sendOTP } = require('../../Controllers/mailController');
const { validateSignupRequest, validateSigninRequest, isRequestValidated, } = require('../../Validator/auth');
const router = express.Router();

router.post('/admin/signin',adminsignin);
router.post('/admin/signup', adminsignup);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/admin/:adminId', fetchAdminDetails);

module.exports = router;