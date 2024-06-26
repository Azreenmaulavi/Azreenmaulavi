const scholarshipModel = require("../Models/scholarshipModel");
exports.createscholarship = async (req, res) => {
  const { classId,scholarshipName, amount } = req.body;
  const create_scholarship = new scholarshipModel({
    classId,
    scholarshipName,
    amount,
  });

  const newScholarship = new scholarshipModel({
    classId,
    scholarshipName,
    amount,
  });

  try {
    newScholarship.save((error, data) => {
      if (error) return res.status(400).json({ status: false, message: "Data not posted", error });
      if (data) {
        res.status(201).json({ status: true, message: "Data posted", data });
      }
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "Failed to create scholarship", err: err });
  }
};

// Get all scholarship's
exports.getAllScholarship = async (req, res) => {
  try {
    const data = await scholarshipModel.find();
    res.json({ status: true, message: "data fetched", data: data });
  } catch {
    (err) => res.json({ status: false, message: "data not Fetched", err: err });
  }
};

// Get scholarship's by ID
exports.getSinglescholarship = async (req, res) => {
  try {
    const data = await scholarshipModel
      .find({ _id: req.params.id })
      .populate("studentId");
    res.json({ status: true, message: "data fetched", data: data });
  } catch (err) {
    res.json({ status: false, message: "data not Fetched", err: err });
  }
};

exports.updatescholarship = (req, res) => {
  const { classId, scholarshipName, amount } = req.body;

  // Check if classId is provided
  if (!classId) {
    return res.status(400).json({ status: false, message: "Class ID is required" });
  }

  scholarshipModel.findOneAndUpdate(
    { classId: classId },
    { scholarshipName: scholarshipName, amount: amount },
    { new: true },
    (err, data) => {
      if (err) {
        console.error("Error updating scholarship:", err);
        return res.status(500).json({ status: false, message: "Failed to update scholarship", error: err });
      }
      if (!data) {
        return res.status(404).json({ status: false, message: "Scholarship not found" });
      }
      res.status(200).json({ status: true, message: "Scholarship updated successfully", data });
    }
  );
};



// Delete scholarship by ID
exports.deletescholarship = (req, res) => {
  scholarshipModel.findOneAndDelete({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.json({ status: false, message: "data not deleted", err: err });
    } else {
      res.json({ status: true, message: "data deleted", data: data });
    }
  });
};
