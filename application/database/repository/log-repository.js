const ActionLog = require('../models').ActionLog;
const ErrorResponse = require('../../util/errorResponse');

//Dealing with data base operations
class LogRepository {

    async create({createData}) {
        try {
            return await ActionLog.create(createData);     
        } catch (err) {
            throw (`Something goes wrong with database`);
        }
    }

    async findLogsById({ id }) {
        try {
            return await ActionLog.findByPk(id);
        } catch (err) {
            throw (`Something goes wrong with database`);
        }
    }

    async update(model, updateData) {
        try {
            return await model.update(updateData);
        } catch (err) {
            throw (`Something goes wrong with database`);
        }
    }
}

module.exports = LogRepository;