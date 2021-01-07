const config = require('../../config')
const APIError = require('../shared/apiError');
const ActionReponse = require('../shared/response');

const HomeController = {
    get: (req, res, next) => {
        return new ActionReponse(res).getDataSucces(res, {
            message : 'Route home',
        })
    },
    getError: (req, res, next) => {
        try {
            // throw error 500
            re
        } catch (error) {
            next(error)
        }
        
    }
}

module.exports = HomeController;