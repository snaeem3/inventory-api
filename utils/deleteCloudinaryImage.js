const cloudinary = require('cloudinary').v2;
const { extractCloudinaryPublicId } = require('./extractCloudinaryPublicId');

/**
 * Deletes an image from Cloudinary based on its URL.
 * @param {string} folderPath - The folder path of the item in cloudinary, do not include a slash at the end
 * @param {string} imageUrl - The URL of the image to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the result of the deletion operation.
 * @throws {Error} Throws an error if the deletion operation fails.
 */
exports.deleteCloudinaryImage = async function (folderPath, imageUrl) {
  // Extract publicId from the image URL
  const publicId = extractCloudinaryPublicId(imageUrl);
  try {
    const result = await cloudinary.uploader.destroy(
      `${folderPath}/${publicId}`
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error deleting image from cloudinary: ', error);
    throw error;
  }
};
