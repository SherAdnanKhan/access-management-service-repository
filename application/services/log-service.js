const { LogRepository } = require("../database");
const ErrorResponse = require("../util/errorResponse");


// All Business logic will be here
class LogService {

    constructor() {
        this.repository = new LogRepository();
    }

    async create(createData) {
        try {
            return await this.repository.create({createData});     
        } catch (err) {
            throw new ErrorResponse(`Something goes wrong with database`, 404);
        }
    }

    async findLogsById(id) {
        try {
            const actionLogUpdate = await this.repository.findLogsById({id});
            if (!actionLogUpdate) {
                throw new (`Action logs not found`);
            } 
            return actionLogUpdate; 
        } catch (err) {
            throw new ErrorResponse(err, 404);
        }
    }

    async update(model, updateData) {
        try {
            return await this.repository.update(model, updateData);     
        } catch (err) {
            throw new ErrorResponse(`Something goes wrong with database`, 404);
        }
    }
}

module.exports = LogService;