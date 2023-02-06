const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const asyncHandler = require('../middlewares/async');
const LogService = require('../services/log-service');
const service = new LogService();

/**
 * @desc   get the Logs
 * @route  get /api/v1/logs/
 * @access Private
 * @param  {req} req
 * @param  {res} res
 * @param  {next} next
 */
exports.getLogs = asyncHandler(async (req, res, next) => {
    title = '';
    const { pagination, sortField, sortOrder } = req.query;
    const { current, pageSize } = pagination;

    let sort = sortField ? [
        [sortField, sortOrder === 'descend' ? 'DESC' : 'ASC']
    ]
        : [['id', 'DESC']];

    let condition = title ? {
        [Op.or]: [
            { employee_id: { [Op.like]: `%${title}%` } },
            { employee_name: { [Op.like]: `%${title}%` } },
            { app_name: { [Op.like]: `%${title}%` } }
        ]
    } : null;
    const response = await service.getLogs({current, pageSize, condition, sort});
    res.status(200).json({ "success": true, data: response });
});

