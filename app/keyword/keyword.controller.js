const _ = require('lodash');
const { ActionResponse, APIError } = require('../../helpers');
const {
  keyword: KeywordModel
} = require('../../infrastructure/database/models');
const config = require('../../config')

const KeywordController = {
  get: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const {
        time: qTime
      } = req.body;
      const qLimit = req.body.limit ? req.body.limit : 10;
      let data;
      var curr = new Date;
      let checkTime = true;
      switch (qTime) {
        case null:
          var gteDate = new Date("2021-01-01T07:30:19.063Z");
          var ltDate = new Date();
          break;
        case 'all':
          var gteDate = new Date("2021-01-01T07:30:19.063Z");
          var ltDate = new Date();
          break;
        case "week":
          var gteDate = new Date(curr.setDate(curr.getDate() - curr.getDay()));
          var ltDate = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
          break;
        case "month":
          var gteDate = new Date(curr.getFullYear(), curr.getMonth(), 1);
          var ltDate = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
          break;
        case "year":
          var gteDate = new Date(new Date().getFullYear(), 0, 1);
          var ltDate = new Date(new Date().getFullYear(), 11, 31);
          break;
        default:
          checkTime = false;
          break;
      }
      if (checkTime) {
        await KeywordModel.aggregate([
          { $match: { date: { $gte: gteDate, $lt: ltDate } } },
          { $group: { _id: '$keyword', i_total: { $sum: 1 } } },
          { $project: { _id: 1, i_total: 1, date: 1 } },
          { $sort: { i_total: -1 } },
          { $limit: qLimit }
        ]).then(function (result) {
          data = result;
        });
      }
      return actionResponse.getDataSuccess(data);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = KeywordController;
