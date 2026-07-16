const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

/**
 * Uploads a single file buffer to Cloudinary and returns { url, public_id }.
 */
const uploadBufferToCloudinary = (buffer, folder = "projects") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Deletes a single image from Cloudinary by its public_id.
 * Never throws — logs and swallows errors so a failed cleanup
 * doesn't block the main request.
 */
const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error(`Cloudinary delete error for ${public_id}:`, error.message);
  }
};

/**
 * Deletes many images from Cloudinary. Accepts an array of
 * { public_id } objects (or plain public_id strings).
 */
const deleteManyFromCloudinary = async (images = []) => {
  await Promise.all(
    images
      .filter(Boolean)
      .map((img) =>
        deleteFromCloudinary(typeof img === "string" ? img : img.public_id),
      ),
  );
};

module.exports = {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  deleteManyFromCloudinary,
};
