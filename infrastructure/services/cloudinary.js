const cloudinary = require('cloudinary').v2;
const { cloudinary: cloudinaryEnv } = require('../../config');

cloudinary.config({
  cloud_name: cloudinaryEnv.name,
  api_key: cloudinaryEnv.apiKey,
  api_secret: cloudinaryEnv.apiSecret,
});

module.exports = {
  uploader: cloudinary.uploader,
};
