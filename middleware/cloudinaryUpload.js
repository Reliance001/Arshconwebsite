const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "projects";

    // Optional: categorize images by field name
    if (file.fieldname.includes("landClearing")) folderName = "landClearing";
    else if (file.fieldname.includes("foundation")) folderName = "foundation";
    else if (file.fieldname.includes("roofing")) folderName = "roofing";
    else if (file.fieldname.includes("blockwork")) folderName = "blockwork";

    return {
      folder: `construction/${folderName}`,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
