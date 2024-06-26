// Example function to create a question

const Exam = require("../Models/examModel");
const Class = require("../Models/classModel");
const Question = require("../Models/questionsModel");

exports.createQuestion = async (req, res) => {
  const { classId,setType, questionText, options, correctAnswer, examId } = req.body;

  try {
    // Check if the exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ status: false, message: "Exam not found" });
    }

    // Create a new question object
    const newQuestion = new Question({
      classId,
      setType,
      questionText,
      options,
      correctAnswer,
      examId
    });

    // Save the question to MongoDB
    const savedQuestion = await newQuestion.save();

    res.status(201).json({
      status: true,
      message: "Question created successfully",
      data: savedQuestion,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Failed to create question",
      error: error.message,
    });
  }
};
// Example function to get all questions related to a specific exam
exports.getQuestionsByExam = async (req, res) => {
  const examId = req.params.examId;
  console.log(`Fetching questions for exam ID: ${examId}`);

  try {
    const questions = await Question.find({ examId })
      // .populate("classId")
      // .populate("examId")

    if (questions) {
      res.json({
        status: true,
        message: "Questions fetched successfully",
        data: questions,
      });
    } else {
      res.json({
        status: false,
        message: "No questions found for the given exam ID",
        data: [],
      });
    }
  } catch (err) {
    console.error(`Error fetching questions for exam ID: ${examId}`, err);
    res.status(500).json({
      status: false,
      message: "Failed to fetch questions",
      error: err.message,
    });
  }
};

// exports.getQuestionsByClass = async (req, res) => {
//   try {
//     const classId = req.params.classId;
//     console.log("classId: ", classId);

//     // Fetch questions where classId matches and populate related class and exam info
//     const questions = await Question.find({ classId })
//       // .populate("classId")
//       .populate("examId")
//       .exec(); 

//     res.json({
//       status: true,
//       message: "Questions fetched successfully",
//       data: questions,
//     });
//   } catch (err) {
//     console.error("Error fetching questions:", err);
//     res.status(500).json({ status: false, message: "Failed to fetch questions", error: err.message });
//   }
// };

// exports.getQuestionsByClass = async (req, res) => {
//   try {
//     const classId = req.params.classId;
//     console.log("classId: ", classId);

//     const questions = await Question.find({ classId });

//     res.json({
//       status: true,
//       message: "Questions fetched successfully",
//       data: questions,
//     });
//   } catch (err) {
//     console.error("Error fetching questions:", err);
//     res.status(500).json({ status: false, message: "Failed to fetch questions", error: err.message });
//   }
// };

exports.getQuestionsByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    console.log("classId: ", classId);

    const questions = await Question.find({ classId });

    // Shuffle the questions array
    const shuffledQuestions = shuffleArray(questions);

    // Send only three questions
    const selectedQuestions = shuffledQuestions.slice(0, 1);

    res.json({
      status: true,
      message: "Questions fetched successfully",
      data: selectedQuestions,
    });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ status: false, message: "Failed to fetch questions", error: err.message });
  }
};

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


exports.getQuestionsBySetAndExam = async (req, res) => {
  const { setId, examId } = req.params;

  try {
    const questions = await Question.find({ setId, examId })
      .populate("classId")
      .populate("examId")
      .populate("setId");
    res.json({
      status: true,
      message: "Questions fetched successfully",
      data: questions,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch questions", err: err });
  }
};

exports.updateQuestion = (req, res) => {
  Question.findOneAndUpdate(
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

exports.deleteQuestion = async (req, res) => {
  const questionId = req.params.id;
  try {
    const deletedExam = await Question.findByIdAndDelete(questionId);
    if (!deletedExam) {
      return res.status(404).json({ status: false, message: "Exam not found" });
    }
    res.json({
      status: true,
      message: "Exam deleted successfully",
      data: deletedExam,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Failed to delete exam", err: err });
  }
};

exports.getSingleQuestion = async (req, res) => {
  try {
    const data = await Question.find({ _id: req.params.id })
      .populate("classId")
      .populate("examId")
      .populate("setId");
    res.json({ status: true, message: "data fetched", data: data });
  } catch (err) {
    res.json({ status: false, message: "data not Fetched", err: err });
  }
};
