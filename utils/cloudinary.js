const cloudinary = require("cloudinary").v2;

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploads = (file, fileName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        public_id: `stulet/property/${fileName}`,
        resource_type: "auto",
      },
      (err, res) => {
        if (err) {
        //   console.log("cloudinary err:", err);
          reject({ err, link: null, publicId: null });
        } else {
        //   console.log("cloudinary res:", res);
          resolve({
            url: res.url,
            id: res.public_id,
          });
        }
      }
    );
  });
};
