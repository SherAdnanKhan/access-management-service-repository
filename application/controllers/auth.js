const asyncHandler = require('../middlewares/async');
const AuthService = require('../services/auth-service');
const { sendTokenResponse } = require("../util");
const service = new AuthService();
/**
 * @desc   login the user
 * @route  Get /api/v1/auth/login
 * @access Public
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.login = asyncHandler(async (req, res, next) => {
    // Attempt Login 
    const { email, password } = req.body;
    const existingUser = await service.login({ email, password });
    sendTokenResponse(existingUser, 200, res);
});

/**
 * @desc   Get the current login user
 * @route  GET /api/v1/auth/me
 * @access private
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.getMe = asyncHandler(async (req, res, next) => {
    // Get the login user
    const { id } = req.user;
    const existingUser = await service.getProfile(id);
    res.status(200).json({ "success": true, data: existingUser });

});

/**
 * @desc   Logout the user
 * @route  GET /api/v1/auth/logout
 * @access private
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.logout = asyncHandler(async (req, res, next) => {
    // Logout a user
    const { id } = req.user;
    await service.getProfile(id);
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ "success": true, msg: 'Logout successfully' });
});

/**
 * @desc   Update user details
 * @route  GET /api/v1/auth/updatedetails
 * @access private
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
    // Update the details of user
    const fieldsToUpdate = {
        name: req.body.user.name,
        email: req.body.user.email,
    };
    if (req.body.user.password) {
        fieldsToUpdate.password = req.body.user.password
    }

    const existingUser = await service.getProfile(req.user.id);

    if (req.body.user.password) {
        await service.matchPassword(existingUser, req.body.user.currentPassword);
    }

    const user = await service.updateUser(existingUser, fieldsToUpdate);

    sendTokenResponse(user, 200, res);
}); 