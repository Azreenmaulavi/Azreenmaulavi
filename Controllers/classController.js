const classModel = require("../Models/classModel");
exports.createClass = async (req, res) => {
  const { className, description } = req.body;
  const create_Class = new classModel({
    className,
    description,
  });

  create_Class.save((error, data) => {
    if (error)
      return res
        .status(400)
        .json({ status: false, message: "data not posted", err: err });
    if (data) {
      res
        .status(201)
        .json({ status: true, message: "data Posted", data: data });
    }
  });
};

// Get all Class's
exports.getClass = async (req, res) => {
  try {
    const data = await classModel.find();
    res.json({ status: true, message: "data fetched", data: data });
  } catch {
    (err) => res.json({ status: false, message: "data not Fetched", err: err });
  }
};

// Get Class's by ID
exports.getSingleClass = async (req, res) => {
  try {
    const data = await classModel.find({ _id: req.params.id });
    res.json({ status: true, message: "data fetched", data: data });
  } catch (err) {
    res.json({ status: false, message: "data not Fetched", err: err });
  }
};

// Update Class's by ID
exports.updateClass = (req, res) => {
  classModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, data) => {
      try {
        res.json({ status: true, message: "data updated", data: data });
      } catch (err) {
        res.json({ status: true, message: "data not updted", data: data });
      }
    }
  );
};

// Delete Class by ID
exports.deleteClass = (req, res) => {
  classModel.findOneAndDelete({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.json({ status: false, message: "data not deleted", err: err });
    } else {
      res.json({ status: true, message: "data deleted", data: data });
    }
  });
};
