const express = require('express');
const uploads = require("../middleware/uploads"); // Change the import statement

const { getUsersCount, updateUser } = require('../Controllers/userController'); 
const router = express.Router();

router.get('/student/getAllStudents', getUsersCount);
// Route to handle photo upload
router.put("/updateStudentProfile/:id",uploads.single("profilePicture"),updateUser); // Use updateuser function

module.exports = router;
