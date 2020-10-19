const cloudinary = require("../../utils/cloudinary");
const fs = require("fs");

exports.uploadEvidenceImages = async (files) => {
//   const files = req.files;
  try {
    const urls = [];
    const uploader = async (path, filename) =>
      await cloudinary.uploads(path, filename);
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path, file.filename);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    //   const property = await Property.findByIdAndUpdate(
    //     req.params.id,
    //     { $push: { propertyImages: { $each: urls } } },
    //     { new: true }
    //   );
    return urls;
    //   return successWithData(res, 200, "Images upload success", property);
  } catch (err) {
    return err;
    //   return tryCatchError(res, err);
  }
};
