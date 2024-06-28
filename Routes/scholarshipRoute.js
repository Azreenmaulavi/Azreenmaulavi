const express = require("express");
const router = express.Router();

// Create Address routes
router.post(
  "/scholarship/create",
  require("../Controllers/scholarshipsController").createscholarship
);

// Get Address routes
router.get(
  "/scholarship/getAll",
  require("../Controllers/scholarshipsController").getAllScholarship
);

router.post(
  '/result/sendEmail/:studentId',
  require("../Controllers/mailController").sendScholarshipEmail
)
// router.get(
//   "/scholarship/get/:id",
//   require("../Controllers/scholarshipsController").getscholarship
// );

// Delete Address routes
router.delete(
  "/scholarship/delete/:id",
  require("../Controllers/scholarshipsController").deletescholarship
);

// Update routes
router.put(
  "/scholarship/update",
  require("../Controllers/scholarshipsController").updatescholarship
);

module.exports = router;
