const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(
      null,
      `${new Date().toISOString().replace(/[\/\\:]/g, "_")}-${uuidv4()}-${
        file.originalname
      }`
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new Error("invalid filetype"), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadImage = upload.array('image');

module.exports = uploadImage;
