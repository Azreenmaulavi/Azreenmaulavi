const express = require('express');
const {adminsignin,adminsignup,fetchAdminDetails,changePassword} = require('../../Controllers/admin/admin');

const { validateSignupRequest, validateSigninRequest, isRequestValidated, } = require('../../Validator/auth');
const router = express.Router();

router.post('/admin/signin',adminsignin);
router.post('/admin/signup', adminsignup);
router.get('/admin/:adminId', fetchAdminDetails);
router.put('/admin/change-password/:adminId', changePassword);

module.exports = router;