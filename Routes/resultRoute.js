const express = require("express");
const router = express.Router();

// Create Address routes
router.post(
  "/result/create",
  require("../Controllers/resultController").createResult
);

// Get Address routes
router.get(
  "/result/getByClassId/:classId",
  require("../Controllers/resultController").getResultByClassId
);

router.get("/result/getAllResultsWithUserDetails/:examId",
  require("../Controllers/resultController").getAllResultsWithUserDetails
)

router.get(
  "/result/exam/:examId",
  require("../Controllers/resultController").getResultsByExam
);

router.get(
  "/result/getResultByStudentid/:studentId",
  require("../Controllers/resultController").getResultByStudentid
);
// router.get(
//   "/result/set/:setId",
//   require("../Controllers/resultController").getResultsBySet
// );

router.get(
  "/result/getbystudentandexam/:studentId/:examId",
  require("../Controllers/resultController").getResultsByStudentAndExam
);
router.get(
  "/result/get/:id",
  require("../Controllers/resultController").getSingleResult
);

// Delete Address routes
router.delete(
  "/result/:id",
  require("../Controllers/resultController").deleteResult
);

// Update Address routes
router.put(
  "/result/:id",
  require("../Controllers/resultController").updateResult
);

module.exports = router;
