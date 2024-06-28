const examModel = require("../Models/examModel");
const examRegister=require("../Models/examRegisterModel")

exports.createExam = async (req, res) => {
  const {
    examName,
    classId,
    duration,
    maxMarks,
    isActive,
    isPaid,
    amount,
  } = req.body;
  console.log(duration)

  const newExam = new examModel({
    examName,
    classId,
    duration,
    maxMarks,
    isActive,
    isPaid,
    amount,
  });

  try {
    newExam.save((error, data) => {
      if (error) return res.status(400).json({ status: false, message: "Data not posted", error });
      if (data) {
        res.status(201).json({ status: true, message: "Data posted", data });
      }
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "Failed to create exam", err: err });
  }
};

exports.getExams = async (req, res) => {
  try{
    const data = await examModel.find();
    res.json({status:true,message:"data fetched",data:data});
}
catch{(err)=>res.json({status:false,message:"data not Fetched",err:err})};
};



exports.updateExam = async (req, res) => {
  const examId = req.params.id;
  const updateData = req.body;
  try {
    const updatedExam = await examModel.findByIdAndUpdate(examId, updateData, {
      new: true,
    });
    if (!updatedExam) {
      return res.status(404).json({ status: false, message: "Exam not found" });
    }
    res.json({
      status: true,
      message: "Exam updated successfully",
      data: updatedExam,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Failed to update exam", err: err });
  }
};

exports.deleteExam = async (req, res) => {
  const examId = req.params.id;
  try {
    const deletedExam = await examModel.findByIdAndDelete(examId);
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

exports.getExamByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    console.log("classId: ", classId);

    const exams = await examModel.find({ classId: classId }); // Use classId to filter exams

    res.json({
      status: true,
      message: "Exams fetched successfully",
      data: exams,
    });
  } catch (err) {
    console.error("Error fetching Exams:", err);
    res.status(500).json({ status: false, message: "Failed to fetch Exams", error: err.message });
  }
};

exports.getExamNamesByStudentId = async (req, res) => {
  try {
    const examId = req.params.examId;

    // Find exams registered by the student
    const registeredExams = await examRegister.find({ examId });

    if (!registeredExams || registeredExams.length === 0) {
      return res.status(404).json({ status: false, message: "No exams found for this student" });
    }

    // Extract examIds from registered exams
    const examIds = registeredExams.map(exam => exam.examId);

    // Find exam details for the registered exams
    const exams = await examModel.find({ _id: { $in: examIds } });

    if (!exams || exams.length === 0) {
      return res.status(404).json({ status: false, message: "No exams found for this student" });
    }

    // Extract exam names from exam details
    const examNames = exams.map(exam => exam.examName);

    res.json({ status: true, message: "Exams fetched successfully", data: examNames });
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};


exports.getCount=async(req,res)=>{
  try {
    const count = await examModel.countDocuments();
    res.json({ status: true, message: "Count fetched", count: count });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ status: false, message: "Failed to fetch count" });
  }

}

//get single exam by id
exports.getOneExam = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the exam by ID
    const exam = await examModel.findById(id);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // If exam found, send it in response
    res.status(200).json(exam);
  } catch (error) {
    // Handle errors
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};