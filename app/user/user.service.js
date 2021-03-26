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
        const { currentUser, file } = req;
        if (file) {
          const [{ public_id: publicId, url }] = await Promise.all([
            await imageService.upload(file.originalname, file.buffer),
            await imageService.deleteResourceById(
              _.get(currentUser, 'avatar.publicId')
            ),
          ]);
          req.body.avatar = { publicId, url };
          console.log(req.avatar);
        }
        next();
      } catch (err) {
        next(err);
      }
    });
  },
  toJson: async (data) => {
    const transform = async (record) => {
      const JsonData = record.toJSON();
      JsonData.avatarUrl = _.get(JsonData, 'avatar.url');
      Reflect.deleteProperty(JsonData, 'avatar');
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
