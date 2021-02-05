const jwtService = require('./jwt');
const emailService = require('./email');
const getProductAPI = require('./getapi/product');

module.exports = {
    jwtService,
    emailService,
    getProductAPI
}