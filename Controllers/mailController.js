const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const User = require("../Models/userModel");

dotenv.config();

exports.sendEmail = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Find student by studentId
    const student = await User.findById(studentId);

    if (!student) {
      console.error(`Student with ID ${studentId} not found`);
      return res.status(404).json({ message: 'Student not found' });
    }

    const { email, firstName } = student;

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




// SEnding email after Signup 

exports.sendEmail1 = async (user) => {
  try {
    const { email, firstName } = user;

    // Create transporter using Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.MAIL_PORT,
      secure: false,
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
