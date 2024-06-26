const mongoose = require("mongoose");

const examRegisterSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    examCode: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    isExamCompleted: { type: Boolean, required: true,default:false },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamRegister", examRegisterSchema);
