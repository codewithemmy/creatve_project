const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { BranchService } = require("./branch.service")

const createBranchController = async (req, res, next) => {
  const value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    BranchService.createBranch(value, res.locals.jwt._id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getBranchController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    BranchService.getBranchService(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateBranchController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    BranchService.updateBranchService(value, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, 200, data)
}

const deleteBranchController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    BranchService.deleteBranchService(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, 200, data)
}

module.exports = {
  createBranchController,
  getBranchController,
  updateBranchController,
  deleteBranchController,
}
