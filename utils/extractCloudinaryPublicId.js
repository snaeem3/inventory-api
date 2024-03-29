/**
 * Extracts the public ID from a Cloudinary image URL.
 * @param {string} imageUrl - The Cloudinary image URL.
 * @example
 * // returns 'sample'
 * extractCloudinaryPublicID('https://res.cloudinary.com/demo/image/upload/v1557237751/sample.jpg')
 * @returns {string} The public ID extracted from the URL.
 */
exports.extractCloudinaryPublicId = function (imageUrl) {
  const parts = imageUrl.split('/');
  const filename = parts.pop();
  const public_id = filename.split('.')[0];
  return public_id;
};
