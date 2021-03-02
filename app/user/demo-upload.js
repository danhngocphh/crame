const DatauriParser = require('datauri/parser');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const parser = new DatauriParser()

const cloudinary = require('cloudinary').v2;
const { cloudinary: cloudinaryEnv } = require('../../config');

cloudinary.config({
  cloud_name: cloudinaryEnv.name,
  api_key: cloudinaryEnv.apiKey,
  api_secret: cloudinaryEnv.apiSecret,
});

exports.uploadAvatar = (req, res, next) => {
    upload.single('avatar')(req, res , async (error) => {
      try {
        if(error) return next(error)
        const fileToUpload = parser.format(path.extname(req.file.originalname), req.file.buffer)
        const result = await cloudinary.uploader.upload(fileToUpload.content)
        console.log(result);
        next()
      } catch (error) {
        next(error)
      }
    });
}