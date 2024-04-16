const multer = require('multer');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname + '--' + Date.now());
  },
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'video/mp4'
  ) {
    return cb(null, true);
  }

  return cb(null, false);
};

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10000000 },
});

module.exports = uploader;
