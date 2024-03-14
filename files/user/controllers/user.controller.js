const { BAD_REQUEST, SUCCESS } = require("../../../constants/statusCode")
const { responseHandler } = require("../../../core/response")
const { manageAsyncOps, fileModifier } = require("../../../utils")
const { CustomError } = require("../../../utils/errors")
const { StudentService } = require("../../student/student.service")
const { UserService } = require("../../user/services/user.service")

const createUserController = async (req, res, next) => {
  let value = await fileModifier(req)
  const { body } = value
  if (body.accountType === "student") {
    const [error, data] = await manageAsyncOps(
      StudentService.createStudent(value, res.locals.jwt)
    )

    if (error) return next(error)

    if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

    return responseHandler(res, SUCCESS, data)
  }
  const [error, data] = await manageAsyncOps(
    UserService.createUser(value, res.locals.jwt)
  )

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

const userLoginController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(UserService.userLogin(req.body))

  if (error) return next(error)

  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))

  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createUserController,
  userLoginController,
}
