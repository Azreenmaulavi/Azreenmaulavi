const express = require("express");
const router = express.Router();

// Create Address routes
router.post(
  "/answers/create",
  require("../Controllers/studentAnsController").createAns
);

// Get Address routes
router.get(
  "/answers/getAll",
  require("../Controllers/studentAnsController").getAns
);
router.get(
  "/answers/get/:id",
  require("../Controllers/studentAnsController").getSingleAns
);

// Delete Address routes
router.delete(
  "/answers/:id",
  require("../Controllers/studentAnsController").deleteAns
);

// Update Address routes
router.put(
  "/answers/:id",
  require("../Controllers/studentAnsController").updateAns
);

module.exports = router;
