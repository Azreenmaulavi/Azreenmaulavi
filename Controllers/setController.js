const setModel = require("../Models/setModel");
exports.createset = async (req, res) => {
  const { setName, description } = req.body;
  const create_set = new setModel({
    setName,
    description,
  });

  create_set.save((error, data) => {
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

// Get all set's
exports.getset = async (req, res) => {
  try {
    const data = await setModel.find();
    res.json({ status: true, message: "data fetched", data: data });
  } catch {
    (err) => res.json({ status: false, message: "data not Fetched", err: err });
  }
};

// Get set's by ID
exports.getSingleset = async (req, res) => {
  try {
    const data = await setModel.find({ _id: req.params.id });
    res.json({ status: true, message: "data fetched", data: data });
  } catch (err) {
    res.json({ status: false, message: "data not Fetched", err: err });
  }
};

// Update set's by ID
exports.updateset = (req, res) => {
  setModel.findOneAndUpdate(
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

// Delete set by ID
exports.deleteset = (req, res) => {
  setModel.findOneAndDelete({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.json({ status: false, message: "data not deleted", err: err });
    } else {
      res.json({ status: true, message: "data deleted", data: data });
    }
  });
};
