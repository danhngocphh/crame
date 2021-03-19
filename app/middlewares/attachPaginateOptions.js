const _ = require('lodash');

const validOrder = ['asc', 'desc'];

const attachPaginateOptions = (req, res, next) => {
  const order = _.get(req, 'query.order');
  const paginateOptions = {
    page: _.get(req, 'query.page', 1),
    limit: _.get(req, 'query.limit', 10),
    sort: {
      [_.get(req, 'query.sortBy', '_id')]: _.includes(validOrder, order) ? order : 'desc',
    },
  };
  req.paginateOptions = paginateOptions;
  next();
};

module.exports = attachPaginateOptions;
