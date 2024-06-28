const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    username: {type: String,required: true,trim: true,min: 3,max: 20},
    hash_password: {type: String,required: true},
    role: {type: String,default: "admin"},
   
  },
  { timestamps: true }
);
userSchema.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
});

userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};
userSchema.methods = {
  matchPassword: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
  generateToken: async function () {
    return jwt.sign(
      { _id: this._id, username: this.username, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  },
};

module.exports = mongoose.model("admin", userSchema);