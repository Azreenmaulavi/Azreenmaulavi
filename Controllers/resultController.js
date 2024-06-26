const mongoose = require('mongoose');
const Result = require("../Models/resultModel");
const Exam = require("../Models/examModel");
const Class = require("../Models/classModel");
const User = require("../Models/userModel");
const Answer = require("../Models/studentansModel");

exports.createResult = async (req, res) => {
  const { marks, totalMarks, classId, examId,studentId } = req.body;

  try {
    // Ensure exam and class exist before creating Result
    // const exam = await Exam.findById(examId);
    // const classObj = await Class.findById(classId);
    // const studentObj = await student.findById(studentId);

    // if (!exam || !classObj || !setObj || !studentObj) {
    //   return res
    //     .status(404)
    //     .json({ status: false, message: "Exam or class not found" });
    // }

    const newResult = new Result({
      totalMarks,
      marks,
      classId,
      examId,
      studentId,
    });

    const savedResult = await newResult.save();
    res.status(201).json({
      status: true,
      message: "Result created successfully",
      data: savedResult,
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "Failed to create Result", err: err });
  }
};

// Fetch all students' results with user details, exam details, and time taken

exports.getAllResultsWithUserDetails = async (req, res) => {
  try {
    const { examId } = req.params;

    // Step 1: Fetch all answers for the given examId
    const answers = await Answer.find({ examId }).select('questionId');

    // Step 2: Query results with populated user and exam details
    const results = await Result.find({ examId })
      .populate({
        path: 'studentId',
        select: 'firstName lastName profilePicture DOB StudClass',
        populate: {
          path: 'StudClass',
          select: 'className',
        },
      })
      .populate('classId', 'className')
      .populate('examId', 'examName')
      .select('percentage createdAt updatedAt'); // Ensure all necessary fields are selected
      console.log("Results",results)

    // Step 3: Array to store enriched results
    const enrichedResults = [];

    // Step 4: Process results
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
    console.log("Results in for loop",result)


      // Step 5: Find corresponding answer for this result
      const answer = answers.find(ans => ans.questionId.toString() === result._id.toString());
      let timeTaken = '00:00';
      if (answer) {
        timeTaken = answer.time;
      } else {
        console.log(`No answer found for questionId: ${result._id}`);
      }

      // Step 6: Fetch student details and calculate age
      let student;
      try {
        student = await User.findById(result.studentId._id);
      } catch (error) {
        console.error(`Error fetching student details for studentId: ${result.studentId._id}`, error);
        continue; // Skip processing this result if there's an error fetching student details
      }

      if (!student) {
        console.log(`Student not found for studentId: ${result.studentId._id}`);
        continue; // Skip processing this result if student not found
      }

      const age = calculateAge(student.DOB);

       // Step 7: Prepare enriched result object
       enrichedResults.push({
        _id: result._id,
        percentage: result.percentage, // Fetch percentage from result
        studentId: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          profilePicture: student.profilePicture,
          DOB: student.DOB,
          age: age,
          classId: result.studentId.StudClass ? result.studentId.StudClass.className : null,
        },
        classId: {
          _id: result.classId._id.toString(),
          className: result.classId.className,
        },
        examId: {
          _id: result.examId._id.toString(),
          examName: result.examId.examName,
        },
        timeTaken: timeTaken,
        age: age,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    }
    console.log("Enrich Results",enrichedResults)

    // Step 8: Return enriched results as JSON response
    return res.json({ data: enrichedResults });
    

  } catch (error) {
    console.error('Error fetching all results with user details:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};



// Function to calculate age based on Date of Birth (DOB)
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'Unknown'; // Handle cases where DOB is not available

  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
// Define the controller function to handle the route logic
exports.getResultByClassId = async (req, res) => {
  // Extract the classId from the request parameters
  const { classId } = req.params;
  console.log("Class id",classId)

  // Check if classId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(classId)) {
    return res.status(400).json({ message: 'Invalid classId format.' });
  }

  try {
    // Query the database to find results by classId
    const results = await Result.find({ classId })
      .populate({
        path: 'studentId',
        model: User,
        select: 'firstName lastName studentId',
      })
      .populate({
        path: 'classId',
        model: Class,
        select: 'className',
      })
      .populate({
        path: 'examId',
        model: Exam,
        select: 'examName',
      });
      console.log("Response of results",results)

    // Check if results exist
    if (results.length === 0) {
      return res.status(404).json({ message: 'No results found for the specified classId.' });
    }

    // Return the results as JSON response
    return res.json({ data: results });
   
  } catch (error) {
    // Handle errors
    console.error('Error fetching results by classId:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
// Example function to get all Results related to a specific exam
exports.getResultsByExam = async (req, res) => {
  const examId = req.params.examId;
  console.log(`Fetching Results for exam ID: ${examId}`);

  try {
    const Results = await Result.find({ examId })
      .populate("classId")
      .populate("examId")
      .populate("setId")
      .populate("studentId");

    if (Results) {
      res.json({
        status: true,
        message: "Results fetched successfully",
        data: Results,
      });
    } else {
      res.json({
        status: false,
        message: "No Results found for the given exam ID",
        data: [],
      });
    }
  } catch (err) {
    console.error(`Error fetching Results for exam ID: ${examId}`, err);
    res.status(500).json({
      status: false,
      message: "Failed to fetch Results",
      error: err.message,
    });
  }
};

exports.getResultsBySet = async (req, res) => {
  const setId = req.params.setId;

  try {
    const Results = await Result.find({ setId })
      .populate("classId")
      .populate("examId")
      .populate("studentId")
      .populate("setId");
    res.json({
      status: true,
      message: "Results fetched successfully",
      data: Results,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch Results", err: err });
  }
};

exports.getResultsBySetAndExam = async (req, res) => {
  const { setId, examId } = req.params;

  try {
    const Results = await Result.find({ setId, examId })
      .populate("classId")
      .populate("examId")
      .populate("studentId")
      .populate("setId");
    res.json({
      status: true,
      message: "Results fetched successfully",
      data: Results,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch Results", err: err });
  }
};
exports.getResultsByStudentAndExam = async (req, res) => {
  const { studentId, examId } = req.params;

  try {
    const Results = await Result.find({ studentId, examId })
      .populate("classId")
      .populate("examId")
      .populate("studentId")
      .populate("setId");
    res.json({
      status: true,
      message: "Results fetched successfully",
      data: Results,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch Results", err: err });
  }
};

exports.updateResult = (req, res) => {
  Result.findOneAndUpdate(
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

exports.deleteResult = async (req, res) => {
  const ResultId = req.params.id;
  try {
    const deletedExam = await Result.findByIdAndDelete(ResultId);
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

exports.getSingleResult = async (req, res) => {
  try {
    const data = await Result.find({ _id: req.params.id })
      .populate("classId")
      .populate("examId")
      .populate("studentId")
      .populate("setId");
    res.json({ status: true, message: "data fetched", data: data });
  } catch (err) {
    res.json({ status: false, message: "data not Fetched", err: err });
  }
};
