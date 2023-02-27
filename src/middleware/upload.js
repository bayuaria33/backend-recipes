const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp");
  },
  filename: function (req, file, cb) {
    const uniq = Date.now() + Math.round(Math.random() * 1e9);
    cb(null, uniq + ".png");
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * Math.pow(1024, 4) },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      const err = new Error('Only image files are allowed!');
      err.status = 400;
      return cb(err, false);
    }
    cb(null, true);
  }
});

module.exports = upload;
