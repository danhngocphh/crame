const cloudinary = require('cloudinary').v2;
const { cloudinary: cloudinaryEnv } = require('../../config');
const path = require('path');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser()

cloudinary.config({
  cloud_name: cloudinaryEnv.name,
  api_key: cloudinaryEnv.apiKey,
  api_secret: cloudinaryEnv.apiSecret,
});

const upload = async (originalname, buffer) => {
  const fileToUpload = parser.format(path.extname(originalname), buffer)
  return await cloudinary.uploader.upload(fileToUpload.content)
}

const getResourceById = async (publicId) => {
  try {
    return await cloudinary.api.resource(publicId);
  } catch (error) {
    if(error.error.http_code === 404) return {};
    throw error;
  }
}

const deleteResourceById = async (publicId) => {
  try {
    return await cloudinary.api.delete_resources(publicId);
  } catch (error) {
    if(error.error.http_code === 404) return;
    throw error;
  }
}

module.exports = {
  upload,
  getResourceById,
  deleteResourceById,
};
