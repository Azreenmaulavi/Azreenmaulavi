const mongoose = require("mongoose");

const AnswersSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    examId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ExamRegister",
        required:true,
    },
    selectedOption: { type: String, required: true },
    time: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("answers", AnswersSchema);
