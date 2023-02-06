const { AuthRepository } = require("../database");
const ErrorResponse = require("../util/errorResponse");


// All Business logic will be here
class AuthService {

    constructor() {
        this.repository = new AuthRepository();
    }

    async login(userInputs) {

        const { email, password } = userInputs;
        try {

            const existingUser = await this.repository.findUser({ email });
            if (existingUser) {

                await this.repository.validatePassword(existingUser, password);
                return existingUser;
            }
            throw new ErrorResponse(`User not found`, 404);

        } catch (err) {
            throw new ErrorResponse(err, 404);
        }


    }

    async getProfile(id) {

        try {
            const existingAuth = await this.repository.FindAuthById({ id });
            return existingAuth;

        } catch (err) {
            throw new ErrorResponse(err, 404);
        }
    }

    async matchPassword(existingUser, password) {

        try {
            const matchPassword = await this.repository.validatePassword(existingUser, password);
            if (matchPassword) {
                return matchPassword;
            }
            else {
                throw new ErrorResponse(`Invalid credentials`, 404);
            }
        } catch (err) {
            throw new ErrorResponse(err, 404);
        }
    }

    async updateUser(existingUser, fieldsToUpdate) {
        try {
            const user = await this.repository.updateUser(existingUser, fieldsToUpdate);
            return user;

        } catch (err) {
            throw new ErrorResponse(err, 404);
        }
    }

}

module.exports = AuthService;