const express = require("express");
const router = express.Router();

// Create Address routes
router.post(
  "/question/create",
  require("../Controllers/questionController").createQuestion
);

// Get Address routes
router.get(
  "/question/exam/:examId",
  require("../Controllers/questionController").getQuestionsByExam
);
router.get(
  "/question/class/:classId",
  require("../Controllers/questionController").getQuestionsByClass
);
router.get(
  "/question/getbysetandexam/:setId/:examId",
  require("../Controllers/questionController").getQuestionsBySetAndExam
);
router.get(
  "/question/get/:id",
  require("../Controllers/questionController").getSingleQuestion
);

// Delete Address routes
router.delete(
  "/question/:id",
  require("../Controllers/questionController").deleteQuestion
);

// Update Address routes
router.put(
  "/question/:id",
  require("../Controllers/questionController").updateQuestion
);

module.exports = router;
