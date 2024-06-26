const express = require("express");
const router = express.Router();

// Route to get all exam registrations
router.get(
  "/examRegister/all",
 require("../Controllers/examRegisterController").saveExamRegistration
);

// Route to get exam registration by ID
router.get(
  "/getExamId/:studentId",
  require("../Controllers/examRegisterController").getExamRegistrationById
);

router.get(
  "/getExam/:examId",
  require("../Controllers/examRegisterController").getExamRegistrationByExamId
);

// Route to save exam registration data
router.post(
  "/exam/register",
  require("../Controllers/examRegisterController").saveExamRegistration
);

router.post(
  "/verify-exam-code/:registrationId",
  require("../Controllers/examRegisterController").verifyExamCode
);

module.exports = router;
