const ErrorResponse = require("../util/errorResponse");
const asyncHandler = require('../middlewares/async');
const ApplicationService = require('../services/application-service');
const LogService = require('../services/log-service');
const service = new ApplicationService();
const logService = new LogService();

/**
 * @desc   get the Applications
 * @route  get /api/v1/applications/
 * @access Private
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.getApplications = asyncHandler(async (req, res, next) => {
    // Get different ibex applications
    const applications  = await service.getApplications();
    res.status(200).json({ "success": true, data: applications });
});

/**
 * @desc   get the Roles by application
 * @route  get /api/v1/applications/:id/roles
 * @access Private
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.getRoles = asyncHandler(async (req, res, next) => {
    // Get all the roles related to ibex application
    let roles = [];
    if (req.params.id === 'announcement') {
        roles = await service.getLocations();
    }
    else {
        roles = await service.applicationRoles(req.params.id);
    }

    res.status(200).json({ "success": true, data: roles });
});



/**
 * @desc   get the Application status
 * @route  get /api/v1/application/application-status
 * @access Private
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.getApplicationStatus = asyncHandler(async (req, res, next) => {
    // get the status of the application for the specific ibex application
    const application = req.body.payload && req.body.payload.application;
    const id = req.body.payload && req.body.payload.ibexUser && req.body.payload.ibexUser.ntlogin;
    const role = req.body.payload && req.body.payload.role;

    if (!application || !id) {
        return next(new ErrorResponse(`Please fill all the required fields`, 404));
    }

    const applicationStatus = await service.getStatus(id, application, role);

    res.status(200).json({ "success": true, data: applicationStatus });
});


/**
 * @desc    Create a ibex application user
 * @route   Put /api/v1/applcation/user
 * @access  Private
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.createUser = asyncHandler(async (req, res, next) => {
    // Attempt to create the user for the specfic ibex application and generate logs
    const app_name = req.body.payload && req.body.payload.application;
    const app_status = true;
    const app_permission = req.body.payload && req.body.payload.permission;
    const ibexUser = req.body.payload && req.body.payload.ibexUser;

    if (!app_name || app_permission === undefined || !ibexUser) {
        return next(new ErrorResponse(`Please fill all the required fields`, 404));
    }

    const createData = {
        employee_id: ibexUser.employee_id,
        employee_email: ibexUser.email,
        employee_name: ibexUser.name,
        ip_address: '0.0.0.0',
        app_name: app_name,
        app_role: app_permission.isArray ? JSON.stringify(app_permission) : app_permission,
        action: app_status,
        user_id: req.user.id
    };

    const actionLog = await logService.create(createData);

    if (actionLog) {
        const userStatus = await service.createUser(ibexUser, app_name, app_permission);

        const updateData = {
            data_request: JSON.stringify(actionLog),
            data_response: JSON.stringify(userStatus),
            request_status: app_status,
            request_message: `Create and enable access for ${app_name}`
        }

        const actionLogUpdate = await logService.findLogsById(actionLog.id);
        await logService.update(actionLogUpdate, updateData);

        if (!userStatus) {
            return next(new ErrorResponse(`Application user already exist!`, 404));
        }
    }
    else {
        return next(new ErrorResponse(`Cannot create to user status`, 404));
    }

    res.status(201).json({ "success": true, msg: 'User Created successfully' });
});


/**
 * @desc    Enable/Disable a ibex application
 * @route   Put /api/v1/applcation/
 * @access  Private
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.updateApplcation = asyncHandler(async (req, res, next) => {
    // Attempt to Update the user status for the specfic ibex application and generate logs
    const app_name = req.body.payload && req.body.payload.application;
    const app_status = req.body.payload && req.body.payload.applicationStatus;
    const app_role = req.body.payload && req.body.payload.role;
    const ibexUser = req.body.payload && req.body.payload.ibexUser;

    if (!app_name || app_status === undefined || !ibexUser) {
        return next(new ErrorResponse(`Please fill all the required fields`, 404));
    }

    const createData = {
        employee_id: ibexUser.employee_id,
        employee_email: ibexUser.email,
        employee_name: ibexUser.name,
        ip_address: '0.0.0.0',
        app_name: app_name,
        app_role: app_role,
        action: app_status,
        user_id: req.user.id
    };

    const actionLog = await logService.create(createData);

    if (actionLog) {
        const applicationStatus = await service.updateStatus(app_status, ibexUser.ntlogin, app_name, app_role);
        const updateData = {
            data_request: JSON.stringify(actionLog),
            data_response: JSON.stringify(applicationStatus),
            request_status: app_status,
            request_message: app_status ? `Enable access for ${app_name}` : `Disable access for ${app_name}`
        }

        const actionLogUpdate = await logService.findLogsById(actionLog.id);

        await logService.update(actionLogUpdate, updateData);

    }
    else {
        return next(new ErrorResponse(`Cannot update to application status`, 404));
    }

    res.status(201).json({ "success": true, msg: 'Application updated successfully' });
});
