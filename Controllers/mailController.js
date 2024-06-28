const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const User = require("../Models/userModel");
const Exam = require("../Models/examModel");
const ExamRegister = require("../Models/examRegisterModel");
const otpGenerator = require("otp-generator"); 

dotenv.config();
 // Create transporter using Nodemailer
 const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for 465, false for other ports
  requireTLS: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


// SEnding email after Signup 

exports.sendSignupEmail = async (user) => {
  try {
    const { email, firstName } = user;

    // Email content (HTML format)
    const mailOptions = {
      from: process.env.USER, 
      to: email, 
      subject: `Thank You for Creating Account`, // Subject line
      html: `<p>Hi ${firstName},<br> We are thrilled to welcome you to our community! Thank you for creating an account with us. Your registration is successful, and you are now part of our platform.<br><h1 style="color: green;">Great Wishes from ScholarNet</h1></p>`
    };

    // Send email using async/await
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

exports.sendScholarshipEmail = async (student) => {
  try {
    // Find student by studentId
    const student = await User.findById(email);
    console.log("Student",emaiil)

    if (!student) {
      console.error(`Student with email ${email} not found`);
      return res.status(404).json({ message: 'Student not found' });
    }

    const { email, firstName } = student;

   

    // Email content (HTML format)
    const mailOptions = {
      from: process.env.USER, // Sender address
      to: email, // List of receivers
      subject: `Scholarship Award Notification`, // Subject line
      html: `<p>Dear ${firstName},<br><br>
        Congratulations! We are pleased to inform you that you have been awarded a scholarship.<br>
        Here are the details:<br><br>
        <strong>Scholarship Details:</strong><br>
        - Scholarship Amount: $XXX<br>
        - Duration: YYYY-MM-DD to YYYY-MM-DD<br>
        - Conditions: Describe any specific conditions or requirements<br><br>
        <strong>Contact Information:</strong><br>
        If you have any questions or need further assistance, please contact us at support@example.com.<br><br>
        <strong style="color: green;">Best Regards,<br>
        ScholarNet</strong></p>`
    };

    // Send email using async/await
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error('Error fetching student details or sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};


// Send OTP
// Function to send OTP to user's email
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP using otp-generator
    const OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    // Save OTP to the user document (optional step)
    user.otp = OTP;
    await user.save();

    // Create transporter using Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email content (HTML format)
    const mailOptions = {
      from: process.env.USER, // Sender address
      to: email, // List of receivers
      subject: 'OTP Verification', // Subject line
      html: `<p>Your OTP for verification is: <strong>${OTP}</strong></p>`
    };

    // Send email using async/await
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP sent:', info.response);
    res.json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};


// Function to send email after registering for an exam
exports.sendExamMail = async ({ email, examName, examCode, formattedDate, name }) => {
  try {

    // Email message
    const mailOptions = {
      from: process.env.USER, // Sender address
      to: email,
      subject: "Exam Registration Confirmation",
      html: `
        <p>Dear ${name},</p>
        <p>You have successfully registered for the exam.</p>
        <p>Details:</p>
        <ul>
          <li style="color: magenta;">Exam Name: ${examName}</li>
          <li style="color: magenta;">Exam Code: ${examCode}</li>
        </ul>
        <p>Please use this exam code before ${formattedDate}.</p>
        <p>Thank you!</p>
      `,
    };

    // Send email using async/await
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};