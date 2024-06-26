const express = require("express");
const router = express.Router();

// Create Address routes
router.post("/exam/create",require("../Controllers/examController").createExam);

// Get  routes
router.get("/exam/getAll", require("../Controllers/examController").getExams);
router.get("/exam/getOne/:id", require("../Controllers/examController").getOneExam);
router.get("/exam/get/:classId",require("../Controllers/examController").getExamByClass);
router.get("/exam/getCount",require("../Controllers/examController").getCount);

// Delete routes
router.delete("/exam/:id", require("../Controllers/examController").deleteExam);

// Update s routes
router.put("/exam/:id", require("../Controllers/examController").updateExam);

// Custom route for fetching exam names by student ID
router.get("/exam/getNamesByStudent/:studentId",require("../Controllers/examController").getExamNamesByStudentId);

module.exports = router;
