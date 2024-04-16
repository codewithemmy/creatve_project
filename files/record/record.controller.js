const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { RecordService } = require("./record.service")

const createRecordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    RecordService.createRecord(req.body, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getRecordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    RecordService.getRecordService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateRecordController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    RecordService.updateRecordService(req.body, req.params.id)
  )
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, 200, data)
}

module.exports = {
  createRecordController,
  getRecordController,
  updateRecordController,
}
