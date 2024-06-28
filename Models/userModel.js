// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const userSchema = new mongoose.Schema(
//   {
//     firstName: { type: String, required: true, trim: true, min: 3, max: 20 },
//     lastName: { type: String, required: true, trim: true, min: 3, max: 20 },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//       lowercase: true,
//     },
//     studentId: { type: String, required: true, trim: true },
//     Contact: { type: String, required: true, trim: true, unique: true },
//     hash_password: { type: String, required: true },
//     role: { type: String, default: "student" },
//     studClass: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "class",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
// userSchema.virtual("password").set(function (password) {
//   this.hash_password = bcrypt.hashSync(password, 10);
// });

// userSchema.methods = {
//   authenticate: async function (password) {
//     return await bcrypt.compare(password, this.hash_password);
//   },
// };
// userSchema.methods = {
//   matchPassword: async function (password) {
//     return await bcrypt.compare(password, this.hash_password);
//   },
//   generateToken: async function () {
//     return jwt.sign(
//       { _id: this._id, username: this.username, role: this.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );
//   },
// };

// module.exports = mongoose.model("student", userSchema);
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    Contact: {
      type: String,
      required: true,
      unique: true,
    },
    StudClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "class",
    },
    Gender: {
      type: String,
    },
    DOB: {
       type: String 
      },

    studentId: { 
      type: String 
    },
    role: { 
      type: String, default: "student" 
    },
    profilePicture: { 
      type: String, default: null 
    },
    otp: { type: String, default: null }, 
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
