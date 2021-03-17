const jwtService = require('./jwt');
const emailService = require('./email');
const getProductAPI = require('./getapi/product');
const getCategoryAPI = require('./getapi/category');
const saveDB = require('./savedb');
const imageService = require('./cloudinary');

module.exports = {
    jwtService,
    emailService,
    imageService,
    getProductAPI,
    getCategoryAPI,
    saveDB
}