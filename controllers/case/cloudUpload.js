const cloudinary = require("../../utils/cloudinary");
const fs = require("fs");

const uploader = async (path, filename) =>
  await cloudinary.uploads(path, filename);

exports.uploadEvidenceImages = async (files = []) => {
  try {
    const urls = [];

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path, file.filename);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    return urls;
  } catch (err) {
    return err;
  }
};

exports.uploadCaseCategoryGroupImages = async (file) => {
  try {
    const { path } = file;
    const filePath = await uploader(path, file.filename);
    fs.unlinkSync(path);

    return filePath;
  } catch (err) {
    return err;
  }
};
