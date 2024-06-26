const express = require("express");
const router = express.Router();

// Create Address routes
router.post(
  "/class/create",
  require("../Controllers/classController").createClass
);

// Get Address routes
router.get("/class/getAll", require("../Controllers/classController").getClass);


router.get(
  "/class/get/:id",
  require("../Controllers/classController").getSingleClass
);

// Delete Address routes
router.delete(
  "/class/:id",
  require("../Controllers/classController").deleteClass
);

// Update Address routes
router.put("/class/:id", require("../Controllers/classController").updateClass);

module.exports = router;
