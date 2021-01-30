const user = require('./user');
const product = require('./product');
const categories = require('./category');
const store = require('./store');
const logcron  = require('./logcron');
const cronjob = require('./cronjob');
const crawlconfig = require('./crawlconfig');
const usergroup = require('./usergroup');
const role = require('./role');


module.exports = {
    user,
    product,
    categories,
    store,
    logcron,
    cronjob,
    crawlconfig,
    usergroup,
    role
}