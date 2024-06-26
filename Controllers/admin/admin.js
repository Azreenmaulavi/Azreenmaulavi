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
