const User = require("../../Models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.adminsignin = async (req, res) => {
  try {
    let { username, password } = req.body;
    User.findOne({ username }).then(async (user) => {
      if (user) {
        const isPassword = await user.matchPassword(password);
        if (isPassword) {
          const token = await user.generateToken();
          const { _id, username, role } = user;
          res.cookie("token", token, { expiresIn: "1d" });
          res.status(200).json({
            token,
            userId: _id,
            user: {
              _id,
              username,
              role,
            },
          });
        } else {
          return res.status(400).json({ message: "Invalid Password" });
        }
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

exports.adminsignup = async (req, res) => {
  try {
    const find = await User.findOne({ username: req.body.username });
    if (find) {
      return res.status(400).json({
        error: "User already registered",
      });
    }
    const { username, password, role } = req.body;
    const _user = new User({
      username,
      password,
      role,
    });
    _user
      .save()
      .then((data) => {
        res.status(201).json({ data });
      })
      .catch((error) => {
        console.log("error", error);
        res.status(400).json({ error: error.message });
      });
  } catch (err) {
    console.log("err", err);

    res.status(500).json({ err: err });
  }
};


// Method to fetch admin details by ID
exports.fetchAdminDetails = async (req, res) => {
  try {
    const { adminId } = req.params; // Assuming you pass adminId in the URL params
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    // Return admin details
    const { _id, username, role } = admin;
    res.status(200).json({
      _id,
      username,
      role,
    });
  } catch (error) {
    console.error('Error fetching admin details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller method to change admin password
exports.changePassword = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Find admin by ID
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, admin.hash_password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin's password
    admin.hash_password = hashedPassword;
    await admin.save();

    // Return success response
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



