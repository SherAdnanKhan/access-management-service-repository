const User = require('../models').User;
const ErrorResponse = require('../../util/errorResponse');

//Dealing with data base operations
class AuthRepository {

    async findUser({ email }) {
        try {
            return await User.findOne({ where: { email: email } });     
        } catch (err) {
            throw (`Something goes wrong with database`);
        }
    }

    async FindAuthById({ id }) {
        try {
            return await User.findByPk(id);
        } catch (err) {
            throw (`Something goes wrong with database`);
        }
    }

    async updateUser(model, fieldsToUpdate) {
        try {
            return await model.update(fieldsToUpdate);
        } catch (err) {
            throw (`Something goes wrong with database`);
        }
    }

    async validatePassword(model, password) {
        try {
            return await model.matchPassword(password);
        } catch (err) {
            throw (`Something goes wrong with database`);
        }
    }
}

module.exports = AuthRepository;