const { getUser } = require("../mysql/queries/bpoQuery");

// All Business logic will be here
class UserService {

    async getIbexUser (id) {
        const userData = await getUser(id);
        if (!userData || userData.length < 1) {
            throw new ErrorResponse(`User not found with id of ${id}`, 404);
        }
        return userData;
    }
 
  
}

module.exports = UserService;