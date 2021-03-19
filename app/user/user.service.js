const multer = require('multer');
const _ = require('lodash');

const { httpStatus } = require('../../config');
const { imageService } = require('../../infrastructure/services');
const { user: UserModel } = require('../../infrastructure/database/models');
const { APIError } = require('../../helpers');
const upload = multer({ storage: multer.memoryStorage() });

const UserService = {
  uploadAvatar: (req, res, next) => {
    upload.single('avatar')(req, res, async (error) => {
      try {
        if (error) return next(error);
        if (req.file)
          req.body.avatarPublicId = (
            await imageService.upload(req.file.originalname, req.file.buffer)
          ).public_id;
        next();
      } catch (err) {
        next(err);
      }
    });
  },
  toJson: async (data) => {
    const transform = async (record) => {
      const JsonData = record.toJSON();
      const avatarUrl = (
        await imageService.getResourceById(JsonData.avatarPublicId)
      ).url;
      _.set(JsonData, 'avatarUrl', avatarUrl);
      Reflect.deleteProperty(JsonData, 'avatarPublicId');
      Reflect.deleteProperty(JsonData, 'password');
      return JsonData;
    };
    if (!_.isArray(data)) return await transform(data);
    return await Promise.all(
      _.map(data, async (record) => await transform(record))
    );
  },
  findUserById: async (req, res, next, userId) => {
    try {
      const userRecord = await UserModel.findById(userId).exec();
      if (!userRecord)
        throw new APIError('Data was not found', httpStatus.NotFound);
      req.user = userRecord;
      return next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserService;
