const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { SubjectService } = require("./subject.service")

const createSubjectController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubjectService.createSubject(req.body, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getSubjectController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubjectService.getSubjectService(req.query, res.locals.jwt.branchId)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateSubjectController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubjectService.updateSubjectService(req.body, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, 200, data)
}

const deleteSubjectController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SubjectService.deleteSubjectService(req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, 200, data)
}

module.exports = {
  createSubjectController,
  getSubjectController,
  updateSubjectController,
  deleteSubjectController,
}
