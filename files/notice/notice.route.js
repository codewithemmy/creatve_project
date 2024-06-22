const noticeRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  createNoticeController,
  getNoticeController,
  updateNoticeController,
  deleteNoticeController,
} = require("./notice.controller")

noticeRoute.route("/").get(getNoticeController)

noticeRoute.use(isAuthenticated)

noticeRoute
  .route("/")
  .post(uploadManager("image").single("image"), createNoticeController)

noticeRoute
  .route("/:id")
  .patch(uploadManager("image").single("image"), updateNoticeController)

noticeRoute.route("/:id").delete(deleteNoticeController)

module.exports = noticeRoute
