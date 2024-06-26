const User = require("../Models/userModel");
const uploads = require("../middleware/uploads");

exports.getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "student" });
    res.json({ status: true, message: "Count fetched", count: count });
  } catch (err) {
    res.json({ status: false, message: "Count not fetched", error: err });
  }
};



// Function to update user profile including profile picture
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Access form fields directly from req.body
    const { firstName, lastName, email, gender, dob, contact, } = req.body;

    // If an image is uploaded, set the image path
    let profilePicture = null;
    if (req.file) {
      profilePicture = req.file.path; // Save the file path in the database
    }

    // Find user by ID and update
    await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      gender,
      dob,
      contact,
      profilePicture,
    });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

