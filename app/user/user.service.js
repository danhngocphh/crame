const multer = require('multer');
const { imageService } = require('../../infrastructure/services');
const upload = multer({ storage: multer.memoryStorage() });
exports.uploadAvatar = (req, res, next) => {
  upload.single('avatar')(req, res, async (error) => {
    try {
      if (error) return next(error);
      if (req.file) req.body.avatarPublicId = (await imageService.upload(req.file.originalname, req.file.buffer)).public_id;
      next();
    } catch (err) {
      next(err);
    }
  });
};
