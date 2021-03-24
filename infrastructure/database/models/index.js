const user = require('./user');
const product = require('./product');
const store = require('./store');
const cronjob = require('./cronjob');
const rootCategory = require('./rootcategory');


module.exports = {
    user,
    rootCategory,
    product,
    store,
    cronjob
}