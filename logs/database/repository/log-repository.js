const ActionLog = require('../models').ActionLog;
const ErrorResponse = require('../../util/errorResponse');
const { getPagingData, getPagination } = require('../../util/pagination');
const User = require('../models').User;

//Dealing with data base operations
class LogRepository {

    async getAllLogs({current, pageSize,  condition, sort}) {
        const { limit, offset } = getPagination(current - 1, pageSize);
        return await ActionLog.findAndCountAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['name']
            }],
            where: condition, limit, offset, order: sort
        })
            .then(data => {
                return getPagingData(data, current - 1, limit);
            })
            .catch(err => {
                throw new ErrorResponse(err, 500);
            });
    }


}

module.exports = LogRepository;