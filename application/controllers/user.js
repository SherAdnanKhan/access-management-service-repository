const ErrorResponse = require("../util/errorResponse");
const asyncHandler = require('../middlewares/async');
const UserService = require('../services/user-service');
const service = new UserService();

/**
 * @desc   Get Ibex User
 * @route  Get /api/v1/dashboard/:id
 * @access Public
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.getIbexUser = asyncHandler(async (req, res, next) => {
    // Get user from ibex global database
    const userData = await service.getIbexUser(req.body.payload);
    res.status(200).json({ "success": true, data: userData[0] });
});
