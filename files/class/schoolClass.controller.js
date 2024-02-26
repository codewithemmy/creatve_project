const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { SchoolClassService } = require("./schoolClass.service")

const createSchoolClassController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SchoolClassService.createSchoolClass(req.body)
  )
  console.log("error", error)
  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const getSchoolClassController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SchoolClassService.getSchoolClass(req.query)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const updateSchoolClassController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    SchoolClassService.updateSchoolClass(req.body, req.params.id)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createSchoolClassController,
  getSchoolClassController,
  updateSchoolClassController,
}
