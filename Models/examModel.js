
const mongoose = require("mongoose");

const examSchema = mongoose.Schema({
    examName: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, default:null, ref:'class' },
    duration: { type: Number }, 
    maxMarks: { type: Number }, 
    isActive: { type: Boolean ,default: true}, 
}, { timestamps: true });

module.exports = mongoose.model("exam", examSchema);
