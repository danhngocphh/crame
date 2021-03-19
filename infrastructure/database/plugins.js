const toJson = require('@meanie/mongoose-to-json');
const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = (mongoose) => {
  mongoose.plugin(toJson);
  mongoose.plugin(mongoosePaginate);
};
