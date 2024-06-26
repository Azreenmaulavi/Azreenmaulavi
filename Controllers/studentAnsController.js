const AnsModel = require("../Models/studentansModel");
const QueModel = require("../Models/questionsModel");
const ExamModel = require("../Models/examModel");
const ResultModel = require("../Models/resultModel");

exports.createAns = async (req, res) => {
  const { studentId, queId, examId, time, answer } = req.body;
  // console.log(studentId)
  // console.log(queId)
  // console.log(examId)
  // console.log(time)
  // console.log(answer)
  const create_Ans = new AnsModel({
    questionId: queId,
    selectedOption: answer,
    studentId,
    examId,
    time,
  });
  // console.log(create_Ans)

  create_Ans.save((error, data) => {
    if (error)
      return res
        .status(400)
        .json({ status: false, message: "data not posted", err: err });
    if (data) {
      res
        .status(201)
        .json({ status: true, message: "data Posted", data: data });
    }
  });
};

// Get all Ans's
exports.getAns = async (req, res) => {
  try {
    const data = await AnsModel.find().populate("questionId");
    res.json({ status: true, message: "data fetched", data: data });
  } catch {
    (err) => res.json({ status: false, message: "data not Fetched", err: err });
  }
};

exports.getSingleAns = async (req, res) => {
  try {
    const userId = req.body.userId;
    const examId = req.params.examId;

    // Validate inputs
    if (!userId || !examId) {
      return res.status(400).json({ status: false, message: "Invalid input" });
    }

    // Fetch full marks and classId from the exam table
    const exam = await ExamModel.findById(examId);
    if (!exam) {
      return res.status(404).json({ status: false, message: "Exam not found" });
    }

    const fullMarks = exam.maxMarks;
    const classId = exam.classId;

    // Fetch answers and questions
    const answers = await AnsModel.find({ examId, studentId: userId });
    const questionsMap = new Map(); 

    const questions = await QueModel.find({ examId });
    questions.forEach((question) => {
      questionsMap.set(question._id.toString(), question);
    });

    // Calculate result
    let result = 0;
    answers.forEach((answer) => {
      const question = questionsMap.get(answer.questionId.toString());

      if (question) {
        const selectedOptionLower = answer.selectedOption.toString().toLowerCase();
        const correctAnswerLower = question.correctAnswer.toString().toLowerCase();

        if (selectedOptionLower === correctAnswerLower) {
          result++;
        }
      }
    });

    // Calculate percentage
    const percentage = (result / fullMarks) * 100;

    const resultInstance = new ResultModel({
      marks: result,
      percentage: percentage,
      studentId: userId,
      examId: examId,
      fullMarks: fullMarks,
      classId: classId
    });

    await resultInstance.save(); // Await the save operation

    res.json({ status: true, message: "Data fetched", data: resultInstance });

  } catch (err) {
    console.error("Error in getSingleAns:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};





// Update Ans's by ID
exports.updateAns = (req, res) => {
  AnsModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, data) => {
      try {
        res.json({ status: true, message: "data updated", data: data });
      } catch (err) {
        res.json({ status: true, message: "data not updted", data: data });
      }
    }
  );
};

// Delete Ans by ID
exports.deleteAns = (req, res) => {
  AnsModel.findOneAndDelete({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.json({ status: false, message: "data not deleted", err: err });
    } else {
      res.json({ status: true, message: "data deleted", data: data });
    }
  });
};
