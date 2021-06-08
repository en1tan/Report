const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

if (!fs.existsSync("public/")) fs.mkdirSync("public");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${new Date()
        .toISOString()
        .replace(/[\/\\:]/g, "_")}-${uuidv4()}-${file.originalname}`,
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (
    (file.mimetype && file.mimetype.startsWith("image")) ||
    (file.mime && file.mime.startsWith("image"))
  ) {
    cb(null, true);
  } else cb(new Error("Invalid filetype"), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const arrayUpload = upload.array("file");
const singleUpload = upload.single("file");

module.exports = { arrayUpload, singleUpload };
