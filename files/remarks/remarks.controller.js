const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { RemarksService } = require("./remarks.service")

const createRemarksController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    RemarksService.createRemarks(req.body)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const getRemarksController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    RemarksService.getRemarks(req.query)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const updateRemarksController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    RemarksService.updateRemarks(req.body, req.params.id)
  )

  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, 200, data)
}

module.exports = {
  createRemarksController,
  getRemarksController,
  updateRemarksController,
}
