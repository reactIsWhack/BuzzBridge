const multer = require('multer');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname + '--' + Date.now());
  },
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
});

const uploader = multer({ storage });

module.exports = uploader;
