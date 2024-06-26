// Import Mongoose
const mongoose = require("mongoose");

// Define schema for scholarship
const scholarshipSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "class",
  },
  scholarshipName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Scholarship = mongoose.model("Scholarship", scholarshipSchema);


module.exports = Scholarship;
