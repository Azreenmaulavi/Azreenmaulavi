const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk/clients/s3');
const shortid = require('shortid');
require('dotenv').config();
const fs = require('fs');

exports.requireSignin = (req, res, next) =>{
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Authorization required" });
  }
  next();
  }


  exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== "user") {
      return res.status(400).json({ message: "User access denied" });
    }
    next();
  };
  
  exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: "Admin access denied" });
    }
    next();
  };




const upload = multer({storage})

