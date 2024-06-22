const { BAD_REQUEST, SUCCESS } = require("../../constants/statusCode")
const { responseHandler } = require("../../core/response")
const { manageAsyncOps, fileModifier } = require("../../utils")
const { CustomError } = require("../../utils/errors")
const { NoticeService } = require("./notice.service")

const createNoticeController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(NoticeService.create(value))
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const getNoticeController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(NoticeService.getNotice(req.query))
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const updateNoticeController = async (req, res, next) => {
  let value = await fileModifier(req)
  const [error, data] = await manageAsyncOps(
    NoticeService.editCampaignService(value, req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

const deleteNoticeController = async (req, res, next) => {
  const [error, data] = await manageAsyncOps(
    NoticeService.deleteCampaignService(req.params.id)
  )
  if (error) return next(error)
  if (!data.success) return next(new CustomError(data.msg, BAD_REQUEST, data))
  return responseHandler(res, SUCCESS, data)
}

module.exports = {
  createNoticeController,
  getNoticeController,
  updateNoticeController,
  deleteNoticeController,
}
