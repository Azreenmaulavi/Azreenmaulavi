const nodemailer = require("nodemailer");
const ExamRegister = require("../Models/examRegisterModel");
const Exam = require("../Models/examModel");

// Function to generate a random 7-digit code
function generateExamCode() {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Controller to save exam registration data and send email
exports.saveExamRegistration = async (req, res) => {
  try {
    const { studentId, classId, examId, name, email } = req.body;

    // Validate required fields
    if (!studentId || !classId || !examId || !name || !email) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Generate a random 7-digit exam code
    const examCode = generateExamCode();

    // Calculate expiration date (1 day from now)
    const expirationDate = new Date();

    expirationDate.setHours(expirationDate.getHours() + 1);
    // expirationDate.setMinutes(expirationDate.getMinutes() + 1);

    const day = String(expirationDate.getDate()).padStart(2, "0");
    const month = String(expirationDate.getMonth() + 1).padStart(2, "0");
    const year = expirationDate.getFullYear();
    const hours = String(expirationDate.getHours()).padStart(2, "0");
    const minutes = String(expirationDate.getMinutes()).padStart(2, "0");
    const seconds = String(expirationDate.getSeconds()).padStart(2, "0");

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    const exams = await Exam.find({ _id: { $in: examId } }).populate(
      "examName"
    );

    const examName = exams.map((exam) => exam.examName);

    // Create a new exam registration object
    const examRegistration = new ExamRegister({
      studentId,
      classId,
      examId,
      examCode,
      name,
      email,
      examCodeExpiration: expirationDate,
    });

    // Save the exam registration data to the database
    const savedExamRegistration = await examRegistration.save();

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "jjhon0461@gmail.com",
        pass: "ozez dxtm ijet kklm",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email message
    const mailOptions = {
      from: "jjhon0461@gmail.com",
      to: email,
      subject: "Exam Registration Confirmation",
      html: `
        <p>Dear ${name},</p>
        <p>You have successfully registered for the exam.</p>
        <p>Details:</p>
        <ul>
          <li style="color:magenta">Exam Name: ${examName}</li>
          <li style="color:magenta">Exam Code: ${examCode}</li>
        </ul>
        <p>Please use this exam code before ${formattedDate}.</p>
        <p>Thank you!</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Exam registration saved successfully and email sent",
      data: savedExamRegistration,
    });
  } catch (error) {
    console.error("Error saving exam registration and sending email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get exam registration by ID
exports.getExamRegistrationById = async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const examRegistrations = await ExamRegister.find({ studentId, isExamCompleted: false });

    if (!examRegistrations || examRegistrations.length === 0) {
      return res
        .status(404)
        .json({ message: "No incomplete exam registrations found for the user." });
    }

    const examIds = examRegistrations.map((registration) => registration.examId);

    const exams = await Exam.find({ _id: { $in: examIds } }).populate("examName");

    const examDetails = exams.map((exam) => ({
      examName: exam.examName,
      registrationId: examRegistrations.find((reg) => reg.examId.toString() === exam._id.toString())._id,
    }));

    res.status(200).json({ examDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getAllExamRegistrations = async (req, res) => {
  try {
    // Query all exam registrations from the database
    const examRegistrations = await ExamRegister.find();

    // If there are no exam registrations, return a 404 error
    if (examRegistrations.length === 0) {
      return res.status(404).json({ error: "No exam registrations found." });
    }

    // If exam registrations exist, return them
    res.status(200).json({ data: examRegistrations });
  } catch (error) {
    console.error("Error fetching exam registrations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to verify exam code and nullify it
exports.verifyExamCode = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { studentId, examCode } = req.body;

    console.log("Verifying exam code for student:", studentId);
    console.log("Registration Id:", registrationId);
    console.log("Exam code:", examCode);

    // Find the exam registration by registrationId
    const examRegistration = await ExamRegister.findOne({
      _id: registrationId,
    });
    if (!examRegistration) {
      console.error(
        "Exam registration not found for registrationId:",
        registrationId
      );
      return res
        .status(404)
        .json({ success: false, error: "Exam registration not found." });
    }

    console.log("exam code from db: ", examRegistration.examCode);
    // Check if exam code matches
    if (
      !examCode ||
      !examRegistration.examCode ||
      examCode.trim() !== examRegistration.examCode.trim()
    ) {
      console.error("Invalid exam code for Registration:", registrationId);
      return res
        .status(400)
        .json({ success: false, error: "Invalid Exam Code." });
    }

    // Exam code verified successfully
    console.log(
      "Exam code verified successfully for Registration:",
      registrationId
    );

    // Nullify the exam code after verification
    // examRegistration.examCode = null;
    // examRegistration.isExamCompleted = true;
    // await examRegistration.save();

    return res
      .status(200)
      .json({ success: true, message: "Exam code verified successfully." });
  } catch (error) {
    console.error("Error verifying exam code:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
};



exports.getExamRegistrationByExamId = async (req, res) => {
  try {
    const { examId } = req.params;
    console.log("Received examId:", examId);

    // Query the exam details from the database using findOne
    const examDetails = await ExamRegister.findOne({ examId: examId });
    console.log("Fetched examDetails:", examDetails);

    // If no exam details are found, return a 404 error
    if (!examDetails) {
      return res.status(404).json({ error: "Exam details not found." });
    }

    // If exam details are found, return them
    res.status(200).json({ data: examDetails });
  } catch (error) {
    console.error("Error fetching exam details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
