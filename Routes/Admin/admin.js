const express = require('express');
const {adminsignin,adminsignup} = require('../../Controllers/admin/admin');
const { validateSignupRequest, validateSigninRequest, isRequestValidated, } = require('../../Validator/auth');
const router = express.Router();

router.post('/admin/signin',adminsignin);
router.post('/admin/signup', adminsignup);

module.exports = router;