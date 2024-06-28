const User = require("../../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {sendEmail1 } = require('../../Controllers/mailController'); 
const fs = require('fs');
const path = require('path');


exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    const findEmail = await User.findOne({ email: req.body.email });
    if (findEmail) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    const findContact = await User.findOne({ Contact: req.body.Contact });
    if (findContact) {
      return res.status(400).json({
        error: "Contact number already registered",
      });
    }

    const {
      firstName,
      lastName,
      email,
      Contact,
      StudClass,
      Gender,
      DOB,
      password,
      role,
    } = req.body;

    // Count the number of users registered this year
    const currentYear = new Date().getFullYear();
    const userCount = await User.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1),
      },
    });

    // Calculate the number of digits needed for padding
    const nextCount = userCount + 1;
    const totalLength = nextCount.toString().length;

    // Generate the student ID with dynamic padding
    const studentCountString = String(nextCount).padStart(totalLength, "0");
    const studentId = `STU/${currentYear}/${studentCountString}`;

    // Hash the password
    const saltRounds = 10; // You can adjust the salt rounds as necessary
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const _user = new User({
      firstName,
      lastName,
      email,
      Contact,
      StudClass,
      Gender,
      DOB,
      password: hashedPassword,
      studentId,
      role,
    });
    console.log(_user);
    await _user.save();
    await sendEmail1(_user);

    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the plain text password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { expiresIn: "1d" });
    res.status(200).json({
      token,
      userId: user._id,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        Contact: user.Contact,
        role: user.role,
        studentClass: user.StudClass,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const response = await User.find();
    const data = response.filter((user) => user.role === "student");
    res.json({ status: true, message: "data fetched", data: data });
  } catch {
    (err) => res.json({ status: false, message: "data not fetched", err: err });
  }
};


exports.getone = async (req, res) => {
  try {
    const { id } = req.params; // Ensure id is correctly received from request parameters

    if (!id) {
      return res.status(400).json({ status: false, message: "User ID parameter is missing" });
    }

    const user = await User.findOne({ id }).populate('StudClass', 'className');

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const profilePicturePath = path.join(__dirname, '..', '..', user.profilePicture.replace(/\\/g, '/'));

    fs.readFile(profilePicturePath, (err, data) => {
      if (err) {
        console.error("Error reading profile picture:", err);
        return res.status(500).json({ status: false, message: "Error fetching profile picture" });
      }

      const profilePictureBase64 = data.toString('base64');

      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        Contact: user.Contact,
        StudClass: user.StudClass,
        Gender: user.Gender,
        DOB: user.DOB,
        studentId: user.studentId,
        role: user.role,
        profilePicture: profilePictureBase64,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        otp: user.otp
      };

      res.status(200).json({
        status: true,
        message: "Data fetched",
        data: userData
      });
    });

  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ status: false, message: "Data not fetched", error: err.message });
  }
};
exports.deleteuser = (req, res) => {
  User.findOneAndDelete({ _id: req.params.id })
    .then((data) => {
      res.json({ status: true, message: "data deleted", data: data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ status: false, message: "data not deleted", err: error });
    });
};

// Controller
exports.updateuser = (req, res) => {
  // Access form fields directly from req.body
  const user = ({ firstName, lastName, email, Contact, photo } = req.body);

  // If an image is uploaded, set the image path
  if (req.file) {
    try {
      user.image = req.file.path;
    } catch (error) {
      console.log(error);
    }
  }

  // Update user data in the database
  User.findOneAndUpdate({ _id: req.params.id }, user, { new: true })
    .then((data) => {
      res.json({ status: true, message: "data updated", data: data });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ status: false, message: "data not Updated", error: error });
    });
};

 




exports.updatePassword = async (req, res) => {
  console.log(req.body);
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email }).exec();

    if (user) {
      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();

      return res.status(200).json({
        status: true,
        message: "Password updated",
      });
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", error: err });
  }
};



// otpController.js



exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("OTP",user.otp)

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP
    user.otp = null;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

