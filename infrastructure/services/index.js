const jwtService = require('./jwt');
const emailService = require('./email');
const getProductAPI = require('./getapi/product');
const getCategoryAPI = require('./getapi/category');
const saveDB = require('./savedb');
const rootCategoryService = require("./rootcategory.services")

module.exports = {
    jwtService,
    emailService,
    getProductAPI,
    getCategoryAPI,
    saveDB,
    rootCategoryService
}