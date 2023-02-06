// Get token from model, create cookie and send response
module.exports.sendTokenResponse = (user, statusCode, res) => {
        const token = user.getSignedJwtToken();

        const options = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
                httpOnly: true
        };

        if (process.env.NODE_ENV === 'production') {
                options.secure = true;
        }

        res.status(statusCode).cookie('token', token, options).json({
                success: true,
                data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        token: token,
                }
        });
};
