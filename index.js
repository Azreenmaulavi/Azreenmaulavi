// Developed By Ketan Gaikwad
const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config(); // Ensure dotenv is configured early
const bodyParser = require("body-parser");
const cors = require("cors");
const adminRoutes = require("./Routes/Admin/auth");
const admin = require("./Routes/Admin/admin");
const classRout = require("./Routes/classRoute");
const setRout = require("./Routes/setRoute");
const examRout = require("./Routes/examRoute");
const questionRout = require("./Routes/questionRoute");
const resultRout = require("./Routes/resultRoute");
const ansRout = require("./Routes/studentAnsRoute");
const scholarshipRout = require("./Routes/scholarshipRoute");
const examRegistrationRout = require("./Routes/examRegistrationRout");
const userRout = require("./Routes/userRoute");
const path = require('path');

connectDB(); // Connect to the database

const app = express();
// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());

// Define routes
app.use("/api", adminRoutes);
app.use("/api", admin);
app.use("/api", classRout);
app.use("/api", setRout);
app.use("/api", examRout);
app.use("/api", resultRout);
app.use("/api", questionRout);
app.use("/api", ansRout);
app.use("/api", scholarshipRout);
app.use("/api", examRegistrationRout);
app.use("/api", userRout);

app.get("/", (req, res) => {
  return res.send("Welcome To Ashraf's Server");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running successfully on port http://localhost:${PORT}`);
});
