const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
    marks:{type:Number, required:true},
    fullMarks:{type:Number, required:true},
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'class', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'exam', required: true },
    percentage:{type:Number, required:true}
}, { timestamps: true });

module.exports = mongoose.model("result", resultSchema);
