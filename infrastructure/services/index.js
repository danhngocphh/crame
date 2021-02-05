const jwtService = require('./jwt');
const emailService = require('./email');
const getProductAPI = require('./getapi/product');
const saveDB = require('./savedb');

module.exports = {
    jwtService,
    emailService,
    getProductAPI,
    saveDB
}