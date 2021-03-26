const result = require('dotenv').config();
if (result.error) {
  throw new Error('.env file not found');
}

module.exports = {
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  https: process.env.HTTPS,
  database: {
    uri: process.env.MONGO_URI,
  },
  cache: {
    uri: process.env.REDIS_URI,
  },
  logs: {
    level: process.env.LOG_LEVEL,
    morganFormat: process.env.MORGAN_FORMAT,
  },
  cronjobs: {
    collection: process.env.DB_COLLECTION,
    pooltime: process.env.POOL_TIME,
    concurrency: process.env.CONCURRENCY,
  },
  token: {
    access_secret: process.env.ACCESS_TOKEN_SECRET,
    access_expired: process.env.ACCESS_TOKEN_EXPIRED,
    refresh_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_expired: process.env.REFRESH_TOKEN_EXPIRED,
    email_secret: process.env.EMAIL_TOKEN_SECRET,
    email_expired: process.env.EMAIL_TOKEN_EXPIRED,
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    template: {
      userConfirmation: 'userConfirmation',
      forgetPassword: 'forgetPassword',
    },
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
  api: {
    prefix: '/api',
  },
  // crawl: {
  //   prefix: '/crawl',
  // },
  cloudinary : {
    name: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  httpStatus: {
    Ok: 200,
    Created: 201,
    BadRequest: 400,
    Unauthorized: 401,
    NotFound: 404,
    ServerError: 500,
  },
  crawler:{
    defaultName: "Đang Cập Nhật",
    nullStore: "Cant find store!",
    nullRootCategory: "Cant find rootCategory!",
    errSetCategory: "Cant set category!",
    errAddCategory: "Cant add category!",
    errAddProduct: "Cant add product!"
  },
  regex: {
    phoneNumber: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    duplicateField: /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i
  },
};
