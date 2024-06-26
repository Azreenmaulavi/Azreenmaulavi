const express = require("express");
const router = express.Router();

// Create Address routes
router.post("/set/create", require("../Controllers/setController").createset);

// Get Address routes
router.get("/set/getAll", require("../Controllers/setController").getset);
router.get(
  "/set/get/:id",
  require("../Controllers/setController").getSingleset
);

// Delete Address routes
router.delete("/set/:id", require("../Controllers/setController").deleteset);

// Update Address routes
router.put("/set/:id", require("../Controllers/setController").updateset);

module.exports = router;
