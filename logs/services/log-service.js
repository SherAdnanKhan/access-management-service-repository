const { LogRepository } = require("../database");
const ErrorResponse = require("../util/errorResponse");


// All Business logic will be here
class LogService {

    constructor() {
        this.repository = new LogRepository();
    }

    async getLogs(data) {
        try {
            return this.repository.getAllLogs(data);
        } catch (err) {
            throw new ErrorResponse(err, 404);
        }
    }

}

module.exports = LogService;