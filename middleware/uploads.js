const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure 'uploads' directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname); // Unique file name handling
  }
});

// File filter function to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

// Initialize multer middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
