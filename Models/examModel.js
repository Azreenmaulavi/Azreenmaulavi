
const mongoose = require("mongoose");

const examSchema = mongoose.Schema({
    examName: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, default:null, ref:'class' },
    duration: { type: Number }, 
    maxMarks: { type: Number }, 
    isActive: { type: Boolean ,default: true}, 
    isPaid: { type: Boolean, default: false }, // New field
    amount: { type: Number, default: 0 },     // New field
}, { timestamps: true });

module.exports = mongoose.model("exam", examSchema);
